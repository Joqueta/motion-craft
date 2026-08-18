import type { Schema, Struct } from '@strapi/strapi';

export interface FritziChallenge extends Struct.ComponentSchema {
  collectionName: 'components_fritzi_challenges';
  info: {
    displayName: 'Challenge';
    icon: 'alert';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.Text & Schema.Attribute.Required;
    paragraphs: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface FritziMetaItem extends Struct.ComponentSchema {
  collectionName: 'components_fritzi_meta_items';
  info: {
    displayName: 'Meta item';
    icon: 'list';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FritziOffering extends Struct.ComponentSchema {
  collectionName: 'components_fritzi_offerings';
  info: {
    displayName: 'Offering';
    icon: 'briefcase';
  };
  attributes: {
    number: Schema.Attribute.String & Schema.Attribute.Required;
    relatedWork: Schema.Attribute.Component<'fritzi.related-project', true>;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    tools: Schema.Attribute.String & Schema.Attribute.Required;
    work: Schema.Attribute.JSON;
  };
}

export interface FritziOverview extends Struct.ComponentSchema {
  collectionName: 'components_fritzi_overviews';
  info: {
    displayName: 'Overview';
    icon: 'file';
  };
  attributes: {
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.Text & Schema.Attribute.Required;
    paragraphs: Schema.Attribute.JSON & Schema.Attribute.Required;
    sideLabel: Schema.Attribute.String;
  };
}

export interface FritziRelatedProject extends Struct.ComponentSchema {
  collectionName: 'components_fritzi_related_projects';
  info: {
    displayName: 'Related project';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FritziTextImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_fritzi_text_image_blocks';
  info: {
    displayName: 'Text image block';
    icon: 'picture';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    paragraphs: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'fritzi.challenge': FritziChallenge;
      'fritzi.meta-item': FritziMetaItem;
      'fritzi.offering': FritziOffering;
      'fritzi.overview': FritziOverview;
      'fritzi.related-project': FritziRelatedProject;
      'fritzi.text-image-block': FritziTextImageBlock;
    }
  }
}
