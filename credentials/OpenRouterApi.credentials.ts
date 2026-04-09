import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OpenRouterApi implements ICredentialType {
  name = 'openRouterApi';
  displayName = 'OpenRouter API';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      typeOptions: {
        password: true,
      },
    },
  ];
}