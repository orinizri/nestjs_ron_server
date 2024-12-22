export const FILE_SIZE_LIMIT: number = 10_485_760;
export const UPLOAD_FILES_VALID_TYPES: string[] = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];
export const FILES_ALLOWED_EXTENSIONS = {
  pdf: { types: ['application/pdf'], hex_prefix: ['255044462D'], isImage: false },
  xlsx: {
    types: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    hex_prefix: ['504B03'],
    isImage: false,
  },
  xls: {
    types: [
      'application/excel',
      'application/vnd.ms-excel',
      'application/x-excel',
      'application/x-msexcel',
    ],
    hex_prefix: ['D0CF11E0A1B11AE1'],
    isImage: false,
  },
  doc: { types: ['application/msword'], hex_prefix: ['0D444F43'], isImage: false },
  docx: {
    types: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    hex_prefix: ['504B03'],
    isImage: false,
  },
  png: { types: ['image/png'], hex_prefix: ['89504E470D0A1A0A'], isImage: true },
  jpg: {
    types: ['image/pjpeg', 'image/jpeg'],
    hex_prefix: ['FFD8FFE0', 'FFD8FFE1', 'FFD8FFE000104A4649460001', 'FFD8FFEE', 'FFD8FFDB'],
    isImage: true,
  },
  jpeg: {
    types: ['image/pjpeg', 'image/jpeg'],
    hex_prefix: ['FFD8FFE1', 'FFD8FFE000104A4649460001', 'FFD8FFEE', 'FFD8FFDB'],
    isImage: true,
  },
};
