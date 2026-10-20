import { MatrixEvent } from "matrix-js-sdk";

const handleReaction = (event: MatrixEvent) => {
  console.log("a reaction occured", event);
};

export default handleReaction;
