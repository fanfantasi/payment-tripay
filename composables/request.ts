import type { FetchRequest, FetchOptions, FetchResponse } from 'ofetch';
import { ofetch } from 'ofetch';

const fetcher = ofetch.create({
    async onRequest({ options }) {
        options.headers = {
            ...options.headers,
        };
    },
    async onResponse({ response }) {
        
    },
});

export default async <T>(request: FetchRequest, options?: FetchOptions) => {
  try {
    const response = await fetcher.raw(request, options);
    return response as FetchResponse<T>;
  } catch (error: any) {
    return error.response as FetchResponse<T>;
  }
};
