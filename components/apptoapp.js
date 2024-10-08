import OpenAI from "openai";
const apptoapp = async (transformationInstruction, input) => {
    const kvObject = Object.assign(input, {})

    const openai = new OpenAI({
        apiKey: localStorage.getItem('OPENAI_API_KEY'), dangerouslyAllowBrowser: true
    });

    let userInput = Object.entries(kvObject).map(([file, contents]) => {
        console.log(file, contents)
      return `${file}:\n\`\`\`${contents.code}\`\`\``;
    }).join("\n");

    const options = {
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": "Perform the task the user requests. answer only in multiple operations, only perform the create_file operation."
        },
        {
          "role": "user",
          "content": transformationInstruction+"\n"+userInput
        }
      ],
      temperature: 1,
      max_tokens: 16383,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      parallel_tool_calls: true,
      tools: [
        {
          "type": "function",
          "function": {
            "name": "create_file",
            "description": "affect changes by calling create_file.",
            "parameters": {
              "type": "object",
              "required": [
                "file_name",
                "contents"
              ],
              "properties": {
                "file_name": {
                  "type": "string",
                  "description": "Name of the file involved in the operation"
                },
                "contents": {
                  "type": "string",
                  "description": "Content to replace in the file when replacing file contents"
                }
              },
              "additionalProperties": false
            },
            "strict": true
          }
        }
      ],
      response_format: {
        "type": "text"
      },
    };
    const response = await openai.chat.completions.create(options);
    const toolCalls = response.choices[0].message.tool_calls;
    console.log('yo', toolCalls)
    const executeFileOperations = async (operations) => {
      for (const operation of operations) {
        const { function: fn } = operation;
        let { file_name, contents } = JSON.parse(fn.arguments);
        kvObject[file_name] = contents;
        console.log(`Created file: ${file_name}`);
        console.log(contents)
      }
    }
    await executeFileOperations(toolCalls)
    return kvObject;
  }
  export default apptoapp