import {ImageIcon} from '@sanity/icons/Image'
import {PlayIcon} from '@sanity/icons/Play'
import {defineField, defineType} from 'sanity'

/** An image with alt text and hotspot/crop. Used everywhere an image appears. */
export const altImage = defineType({
  name: 'altImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines.',
    }),
  ],
})

/**
 * A video. Today the site streams from Vidzflow; an MP4 can be uploaded instead
 * (Sanity then hosts it). The poster shows while the video loads.
 */
export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'source',
      type: 'string',
      options: {
        list: [
          {title: 'Vidzflow', value: 'vidzflow'},
          {title: 'Upload an MP4', value: 'file'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'vidzflow',
    }),
    defineField({
      name: 'vidzflowId',
      title: 'Vidzflow video ID',
      type: 'string',
      description: 'The code after /v/ in the Vidzflow link, e.g. app.vidzflow.com/v/NWeQD24jgn → NWeQD24jgn',
      hidden: ({parent}) => parent?.source === 'file',
    }),
    defineField({
      name: 'file',
      title: 'Video file',
      type: 'file',
      options: {accept: 'video/mp4,video/webm'},
      hidden: ({parent}) => parent?.source !== 'file',
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      description: 'Shown until the video starts playing.',
    }),
  ],
  preview: {
    select: {media: 'poster', id: 'vidzflowId', source: 'source', file: 'file.asset.originalFilename'},
    prepare: ({media, id, source, file}) => ({
      title: source === 'file' ? file || 'Uploaded video' : `Vidzflow · ${id ?? '—'}`,
      media: media ?? PlayIcon,
    }),
  },
})

/** Either an image or a video, e.g. a gallery card. */
export const mediaItem = defineType({
  name: 'mediaItem',
  title: 'Image or video',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'image',
    }),
    defineField({name: 'image', type: 'altImage', hidden: ({parent}) => parent?.kind === 'video'}),
    defineField({name: 'video', type: 'videoEmbed', hidden: ({parent}) => parent?.kind !== 'video'}),
  ],
  preview: {
    select: {kind: 'kind', image: 'image', poster: 'video.poster', alt: 'image.alt', id: 'video.vidzflowId'},
    prepare: ({kind, image, poster, alt, id}) => ({
      title: kind === 'video' ? `Video · ${id ?? ''}` : alt || 'Image',
      media: kind === 'video' ? poster : image,
    }),
  },
})
