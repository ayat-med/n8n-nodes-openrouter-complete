import {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class OpenRouter implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'OpenRouter',
    name: 'openRouter',
    group: ['transform'],
    version: 1,
    description: 'Send requests to OpenRouter API',
    defaults: {
      name: 'OpenRouter',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'openRouterApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: 'openai/gpt-4o',
        description: 'The model to use. See <a href="https://openrouter.ai/models">OpenRouter Models</a>.',
      },
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Max Tokens',
        name: 'maxTokens',
        type: 'number',
        default: 1024,
        description: 'The maximum number of tokens to generate. Lower values help avoid credit limit errors.',
      },
      {
        displayName: 'Temperature',
        name: 'temperature',
        type: 'number',
        typeOptions: {
          minValue: 0,
          maxValue: 2,
        },
        default: 0.7,
        description: 'What sampling temperature to use, between 0 and 2.',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    const credentials = await this.getCredentials('openRouterApi');

    for (let i = 0; i < items.length; i++) {
      const prompt = this.getNodeParameter('prompt', i) as string;
      const model = this.getNodeParameter('model', i) as string;
      const maxTokens = this.getNodeParameter('maxTokens', i) as number;
      const temperature = this.getNodeParameter('temperature', i) as number;

      const response = await this.helpers.request({
        method: 'POST',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
        },
        body: {
          model,
          messages: [
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature,
        },
        json: true,
      });

      returnData.push({ json: response });
    }

    return [returnData];
  }
}