import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class OpenRouter implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'OpenRouter',
    name: 'openRouter',
    icon: { light: 'file:openrouter-svg.svg', dark: 'file:openrouter-svg.svg' },
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
        displayName: 'Output Modalities',
        name: 'output_modalities',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Text', value: 'text' },
          { name: 'Image', value: 'image' },
          { name: 'Audio', value: 'audio' },
          { name: 'Video', value: 'video' },
          { name: 'Embeddings', value: 'embeddings' },
        ],
        default: 'all',
        description: 'Filter models by their output modalities',
      },
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getModels',
          loadOptionsDependsOn: ['output_modalities'],
        },
        default: '',
        required: true,
        description: 'The model to use. Fetched based on your modality selection.',
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

  methods = {
    loadOptions: {
      async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const modalities = this.getCurrentNodeParameter('output_modalities') as string;
        const queryParams = modalities !== 'all' ? `?output_modalities=${modalities}` : '';
        const url = `https://openrouter.ai/api/v1/models${queryParams}`;

        try {
          const response = await this.helpers.request({
            method: 'GET',
            url,
            json: true,
          });

          if (!response.data || !Array.isArray(response.data)) {
            return [];
          }

          return response.data.map((model: any) => ({
            name: model.name || model.id,
            value: model.id,
            description: model.description || `Model ID: ${model.id}`,
          }));
        } catch (error) {
          throw new Error(`Failed to fetch models: ${error.message}`);
        }
      },
    },
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
