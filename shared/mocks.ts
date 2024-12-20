import { User, TableSchema } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'kwilliams@deeporigin.com',
    avatarUrl: '/avatars/kwilliams.png',
  },
  { id: '2', email: 'glima@deeporigin.com', avatarUrl: '/avatars/glima.png' },
  {
    id: '3',
    email: 'srinivas.shandilya@deeporigin.com',
    avatarUrl: '/avatars/srinivas.png',
  },
  {
    id: '4',
    email: 'akash.guru@deeporigin.com',
    avatarUrl: '/avatars/akash.png',
  },
  { id: '5', email: 'jdoe@deeporigin.com', avatarUrl: '/avatars/jdoe.png' },
  { id: '6', email: 'rsmith@deeporigin.com', avatarUrl: '/avatars/rsmith.png' },
  { id: '7', email: 'mbrown@deeporigin.com', avatarUrl: '/avatars/mbrown.png' },
  {
    id: '8',
    email: 'tnguyen@deeporigin.com',
    avatarUrl: '/avatars/tnguyen.png',
  },
  { id: '9', email: 'lclark@deeporigin.com', avatarUrl: '/avatars/lclark.png' },
  {
    id: '10',
    email: 'kperez@deeporigin.com',
    avatarUrl: '/avatars/kperez.png',
  },
];

export const table1: TableSchema = {
  columns: [
    { accessorKey: 'ID', type: 'link', label: 'ID', editable: false },
    { accessorKey: 'Plasmid', type: 'text', label: 'Plasmid', editable: true },
    {
      accessorKey: 'VolumeUI',
      type: 'number',
      label: 'Volume (µL)',
      editable: true,
    },
    {
      accessorKey: 'LengthBP',
      type: 'number',
      label: 'Length (bp)',
      editable: false,
    },
    {
      accessorKey: 'StorageLocation',
      type: 'text',
      label: 'Storage Location',
      editable: false,
    },
    {
      accessorKey: 'EditedBy',
      type: 'user',
      label: 'Edited By',
      editable: true,
    },
  ],
  rows: [
    {
      ID: { url: '/1', value: 'inv-GT-plasmid-1' },
      Plasmid: 'GT-plasmids-1: lentiCRISPR v2',
      VolumeUI: 50,
      LengthBP: 14873,
      StorageLocation: 'Freezer 2 Box A1',
      EditedBy: [
        {
          id: '1',
          email: 'kwilliams@deeporigin.com',
          avatarUrl: '/avatars/kwilliams.png',
        },
      ],
    },
    {
      ID: { url: '/2', value: 'inv-GT-plasmid-2' },
      Plasmid: 'GT-plasmids-2: psPAX2',
      VolumeUI: 30,
      LengthBP: 10704,
      StorageLocation: 'Freezer 2 Box A2',
      EditedBy: [
        {
          id: '2',
          email: 'glima@deeporigin.com',
          avatarUrl: '/avatars/glima.png',
        },
      ],
    },
    {
      ID: { url: '/3', value: 'inv-GT-plasmid-3' },
      Plasmid: 'GT-plasmids-3: pMD2.G',
      VolumeUI: 40,
      LengthBP: 5820,
      StorageLocation: 'Freezer 2 Box A2',
      EditedBy: [
        {
          id: '3',
          email: 'srinivas.shandilya@deeporigin.com',
          avatarUrl: '/avatars/srinivas.png',
        },
      ],
    },
    {
      ID: { url: '/4', value: 'inv-GT-plasmid-4' },
      Plasmid: 'GT-plasmids-4: CRISPRoff-v2.1',
      VolumeUI: 25,
      LengthBP: 11875,
      StorageLocation: 'Freezer 2 Box B1',
      EditedBy: [
        {
          id: '4',
          email: 'akash.guru@deeporigin.com',
          avatarUrl: '/avatars/akash.png',
        },
      ],
    },
    {
      ID: { url: '/5', value: 'inv-GT-plasmid-5' },
      Plasmid: 'GT-plasmids-5: TETv4',
      VolumeUI: 35,
      LengthBP: 11679,
      StorageLocation: 'Freezer 2 Box A2',
      EditedBy: [
        {
          id: '5',
          email: 'jdoe@deeporigin.com',
          avatarUrl: '/avatars/jdoe.png',
        },
      ],
    },
    {
      ID: { url: '/6', value: 'inv-GT-plasmid-6' },
      Plasmid: 'GT-plasmids-6: pRSV-Rev',
      VolumeUI: 45,
      LengthBP: 4180,
      StorageLocation: 'Freezer 2 Box A1',
      EditedBy: [
        {
          id: '6',
          email: 'rsmith@deeporigin.com',
          avatarUrl: '/avatars/rsmith.png',
        },
      ],
    },
    {
      ID: { url: '/7', value: 'inv-GT-plasmid-7' },
      Plasmid: 'GT-plasmids-7: lentiCRISPR v2',
      VolumeUI: 30,
      LengthBP: 14873,
      StorageLocation: 'Freezer 2 Box B1',
      EditedBy: [
        {
          id: '7',
          email: 'mbrown@deeporigin.com',
          avatarUrl: '/avatars/mbrown.png',
        },
      ],
    },
    {
      ID: { url: '/8', value: 'inv-GT-plasmid-8' },
      Plasmid: 'GT-plasmids-8: pAdDeltaF6',
      VolumeUI: 40,
      LengthBP: 15420,
      StorageLocation: 'Freezer 2 Box A3',
      EditedBy: [
        {
          id: '8',
          email: 'tnguyen@deeporigin.com',
          avatarUrl: '/avatars/tnguyen.png',
        },
      ],
    },
    {
      ID: { url: '/9', value: 'inv-GT-plasmid-9' },
      Plasmid: 'GT-plasmids-9: pMDLg',
      VolumeUI: 20,
      LengthBP: 8890,
      StorageLocation: 'Freezer 2 Box A1',
      EditedBy: [
        {
          id: '9',
          email: 'lclark@deeporigin.com',
          avatarUrl: '/avatars/lclark.png',
        },
      ],
    },
    {
      ID: { url: '/10', value: 'inv-GT-plasmid-10' },
      Plasmid: 'GT-plasmids-10: pcDNA-3xHA-hTERT',
      VolumeUI: 50,
      LengthBP: 9027,
      StorageLocation: 'Freezer 2 Box A3',
      EditedBy: [
        {
          id: '10',
          email: 'kperez@deeporigin.com',
          avatarUrl: '/avatars/kperez.png',
        },
      ],
    },
  ],
};

export const table2: TableSchema = {
  columns: [
    { accessorKey: 'ID', type: 'link', label: 'ID', editable: false }, // Updated to 'link' type
    { accessorKey: 'Summary', type: 'text', label: 'Summary', editable: true },
    { accessorKey: 'Status', type: 'tag', label: 'Status', editable: true },
    {
      accessorKey: 'Assignee',
      type: 'user',
      label: 'Assignee',
      editable: true,
    },
  ],
  rows: [
    {
      ID: { url: '/tasks/KT-1', value: 'KT-1' },
      Summary: 'Add pka formula',
      Status: 'todo',
      Assignee: [
        {
          id: '1',
          email: 'kwilliams@deeporigin.com',
          avatarUrl: '/avatars/kwilliams.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-2', value: 'KT-2' },
      Summary: 'Select option ordering',
      Status: 'todo',
      Assignee: [
        {
          id: '2',
          email: 'glima@deeporigin.com',
          avatarUrl: '/avatars/glima.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-3', value: 'KT-3' },
      Summary: 'Database filtering v2',
      Status: 'in-progress',
      Assignee: [
        {
          id: '1',
          email: 'kwilliams@deeporigin.com',
          avatarUrl: '/avatars/kwilliams.png',
        },
        {
          id: '2',
          email: 'glima@deeporigin.com',
          avatarUrl: '/avatars/glima.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-4', value: 'KT-4' },
      Summary: 'Colored labels for select',
      Status: 'todo',
      Assignee: [
        {
          id: '3',
          email: 'srinivas.shandilya@deeporigin.com',
          avatarUrl: '/avatars/srinivas.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-5', value: 'KT-5' },
      Summary: 'Default values for select columns',
      Status: 'todo',
      Assignee: [
        {
          id: '4',
          email: 'akash.guru@deeporigin.com',
          avatarUrl: '/avatars/akash.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-6', value: 'KT-6' },
      Summary: 'Improve UI responsiveness',
      Status: 'in-progress',
      Assignee: [
        {
          id: '5',
          email: 'jdoe@deeporigin.com',
          avatarUrl: '/avatars/jdoe.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-7', value: 'KT-7' },
      Summary: 'Update dependencies',
      Status: 'completed',
      Assignee: [
        {
          id: '6',
          email: 'rsmith@deeporigin.com',
          avatarUrl: '/avatars/rsmith.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-8', value: 'KT-8' },
      Summary: 'Refactor authentication flow',
      Status: 'todo',
      Assignee: [
        {
          id: '7',
          email: 'mbrown@deeporigin.com',
          avatarUrl: '/avatars/mbrown.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-9', value: 'KT-9' },
      Summary: 'Optimize database queries',
      Status: 'in-progress',
      Assignee: [
        {
          id: '8',
          email: 'tnguyen@deeporigin.com',
          avatarUrl: '/avatars/tnguyen.png',
        },
        {
          id: '9',
          email: 'lclark@deeporigin.com',
          avatarUrl: '/avatars/lclark.png',
        },
      ],
    },
    {
      ID: { url: '/tasks/KT-10', value: 'KT-10' },
      Summary: 'Test API error handling',
      Status: 'todo',
      Assignee: [
        {
          id: '10',
          email: 'kperez@deeporigin.com',
          avatarUrl: '/avatars/kperez.png',
        },
      ],
    },
  ],
};
