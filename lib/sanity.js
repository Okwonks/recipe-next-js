import {
  createClient,
  createPreviewSubscriptionHook,
  createImageUrlBuilder,
  createPortableTextComponent,
} from 'next-sanity';

const CONFIG = {
  projectId: 'hwdw5cir',
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: process.env.NODE_ENV === 'production',
};

export const sanityClient = createClient(CONFIG);

export const usePreviewSubscription = createPreviewSubscriptionHook(CONFIG);

export const urlFor = source => createImageUrlBuilder(CONFIG).image(source);

export const PortableText = createPortableTextComponent({ ...CONFIG, serializers:{} });
