((js-mode . ((eval . (prettier-mode t))))
 (typescript-mode . ((eval . (prettier-mode t))))
 (nil . ((project-compilation-mode . js-compilation-mode)
	 (compile-command . "npm ci && npm run build"))))
