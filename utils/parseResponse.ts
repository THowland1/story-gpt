export function parseResponse(response: string): {
  paragraph: string;
  options: { key: string; text: string }[];
} {
  const lines = response.split("\n");

  const indexOfFirstOption = lines.findIndex((o) => o.startsWith("1:"));

  if (indexOfFirstOption === -1) {
    return {
      paragraph: response,
      options: [],
    };
  }

  const options: { key: string; text: string }[] = [];

  for (let index = indexOfFirstOption; index < lines.length; index++) {
    const line = lines[index];
    if (line.startsWith("1: ")) {
      options.push({
        key: "Option 1",
        text: line.replace("1: ", ""),
      });
    }
    if (line.startsWith("2: ")) {
      options.push({
        key: "Option 2",
        text: line.replace("2: ", ""),
      });
    }
    if (line.startsWith("3: ")) {
      options.push({
        key: "Option 3",
        text: line.replace("3: ", ""),
      });
    }
  }
  return {
    paragraph: lines.slice(0, indexOfFirstOption).join("\n"),
    options,
  };
}
