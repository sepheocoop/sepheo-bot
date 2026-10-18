#!/bin/bash
# Parts adapted from Cloudron GitLab app here:
# https://git.cloudron.io/packages/gitlab-app/-/blob/ec06a0a9622d3fc35a6239eaacbacd6b1acc343e/start.sh

set -eu

# ensure that data directory is owned by 'cloudron' user
mkdir -p /app/data/cloudron
chown -R cloudron:cloudron /app/data/cloudron

# and that /app/data is owned by root (so that sshd allows keys in /app/data/worker/.ssh)
chown root:root /app/data

# Make session-persistent directories/files
mkdir -p /run/{worker/npm,sebheo} 
touch /run/worker/bash_history
chown -R worker:worker /run/worker
chown -R cloudron:cloudron /run/sebheo

# Make fully-persistent directories
mkdir -p /app/data/worker/data
    
# SSH_PORT can be unset to disable SSH
if [[ -z "${SSH_PORT:-}" ]]; then
    echo "==> SSH disabled"
    SSH_PORT=29418 # arbitrary port to keep sshd happy
fi

echo "==> Generating ssh host keys (if missing)"

mkdir -p /app/data/sshd /run/sshd/log

# OpenSSH 10 dropped DSA; a TTY (Cloudron PID 1) makes ssh-keygen prompt despite -N ""
for type in rsa ecdsa ed25519; do
    key="/app/data/sshd/ssh_host_${type}_key"
    if [[ ! -f "${key}" ]]; then
        ssh-keygen -qt "${type}" -N "" -f "${key}" </dev/null
    fi
done

chmod 0600 /app/data/sshd/*_key
chmod 0644 /app/data/sshd/*.pub

# generate sshd config
cat > /run/sshd/sshd_config <<EOF
# Package generated configuration file
# See the sshd_config(5) manpage for details

# What ports, IPs and protocols we listen for
Port ${SSH_PORT}
# Use these options to restrict which interfaces/protocols sshd will bind to
ListenAddress 0.0.0.0
Protocol 2
# HostKeys for protocol version 2
HostKey /app/data/sshd/ssh_host_rsa_key
HostKey /app/data/sshd/ssh_host_ecdsa_key
HostKey /app/data/sshd/ssh_host_ed25519_key

# Logging
SyslogFacility AUTH
LogLevel INFO

# Authentication:
LoginGraceTime 120
PermitRootLogin prohibit-password
StrictModes yes

PubkeyAuthentication yes
#AuthorizedKeysFile	%h/.ssh/authorized_keys

# Don't read the user's ~/.rhosts and ~/.shosts files
IgnoreRhosts yes
# similar for protocol version 2
HostbasedAuthentication no
# Uncomment if you don't trust ~/.ssh/known_hosts for RhostsRSAAuthentication
#IgnoreUserKnownHosts yes

# To enable empty passwords, change to yes (NOT RECOMMENDED)
PermitEmptyPasswords no

# Change to yes to enable challenge-response passwords (beware issues with
# some PAM modules and threads)
ChallengeResponseAuthentication no

# Change to no to disable tunnelled clear text passwords
#PasswordAuthentication yes

# Kerberos options
#KerberosAuthentication no
#KerberosGetAFSToken no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes

# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes

X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
#UseLogin no

#MaxStartups 10:30:60
#Banner /etc/issue.net

# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

Subsystem sftp /usr/lib/openssh/sftp-server

# Set this to 'yes' to enable PAM authentication, account processing,
# and session processing. If this is enabled, PAM authentication will
# be allowed through the ChallengeResponseAuthentication and
# PasswordAuthentication.  Depending on your PAM configuration,
# PAM authentication via ChallengeResponseAuthentication may bypass
# the setting of "PermitRootLogin without-password".
# If you just want the PAM account and session checks to run without
# PAM authentication, then enable this but set PasswordAuthentication
# and ChallengeResponseAuthentication to 'no'.
UsePAM no
UseDNS no
EOF

# Ensure worker directory exists
mkdir -p /app/data/worker
chown -R worker:worker /app/data/worker
    
echo "==> Starting supervisor"
exec /usr/bin/supervisord --configuration /etc/supervisor/supervisord.conf --nodaemon -i Supervisor
