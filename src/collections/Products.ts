import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'text',
      required: true,
    },

    {
      name: 'price',
      type: 'number',
      required: true,
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
    },

    {
      name: 'refundPolicy',
      type: 'select',
      options: ['30 days', '60 days', '90 days', 'no-refunds'],
      defaultValue: '30 days',
    },
  ],
};
