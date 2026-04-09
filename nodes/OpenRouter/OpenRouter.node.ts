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
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        default: '',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    const credentials = await this.getCredentials('openRouterApi');

    for (let i = 0; i < items.length; i++) {
      const prompt = this.getNodeParameter('prompt', i) as string;

      const response = await this.helpers.request({
        method: 'POST',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
        },
        body: {
          model: 'openai/gpt-4o',
          messages: [
            { role: 'user', content: prompt },
          ],
        },
        json: true,
      });

      returnData.push({ json: response });
    }

    return [returnData];
  }
}