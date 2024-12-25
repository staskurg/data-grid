import type { AccessorKey } from '../../shared/types';

export const COLUMN_TYPES = {
  LINK: 'link',
  USER: 'user',
  NUMBER: 'number',
  TEXT: 'text',
  TAG: 'tag',
} as const;

export const ACCESSOR_KEYS: Record<string, AccessorKey> = {
  DISPLAY_ID: 'displayId',
  PLASMID: 'plasmid',
  VOLUME_UI: 'volumeUI',
  LENGTH_BP: 'lengthBP',
  STORAGE_LOCATION: 'storageLocation',
  EDITED_BY: 'editedBy',
  SUMMARY: 'summary',
  STATUS: 'status',
  ASSIGNEE: 'assignee',
} as const;
