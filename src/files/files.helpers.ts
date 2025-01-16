import { FILE_SIZE_LIMIT, FILES_ALLOWED_EXTENSIONS } from 'src/utils/constants';

// Helpers
export function validateFile(file: Express.Multer.File) {
  // File exists check
  if (!file?.buffer) {
    return {
      valid: false,
      name: file.filename,
      origin: file.originalname,
      error: 'File not found',
    };
  }
  // Size check
  if (file.size > FILE_SIZE_LIMIT) {
    return {
      valid: false,
      name: file.filename,
      origin: file.originalname,
      error: 'File too big',
    };
  }
  const [folderName, fileName] = Buffer.from(file.originalname, 'binary')
    .toString('utf-8')
    .split('/');
  const extension = fileName.split('.').pop()?.toLowerCase();
  // Extension type check
  if (
    !extension ||
    !Object.keys(FILES_ALLOWED_EXTENSIONS).includes(extension)
  ) {
    return {
      valid: false,
      origin: file.originalname,
      error: 'Extension is not allowed',
    };
  }
  // File signature congruency check
  if (
    !FILES_ALLOWED_EXTENSIONS[extension].hex_prefix.some((hex) =>
      file.buffer.toString('hex').toUpperCase().startsWith(hex),
    )
  ) {
    console.log('@@@', FILES_ALLOWED_EXTENSIONS[extension].hex_prefix);
    return {
      valid: false,
      origin: file.originalname,
      error: `Invalid signature (${file.mimetype}, ${file.buffer.toString('hex').slice(0, 50)})`,
    };
  }
  return {
    valid: true,
    origin: file.originalname,
    error: null,
  };
}

export function validateTimestampAndConvertToDate(timestamp: string | number): {
  valid: boolean;
  error?: string;
  data?: Date;
} {
  // Validate TimeStamp
  if (isNaN(Number(timestamp))) {
    return { valid: false, error: 'Invalid lastModified timestamp' };
  }
  const lastModifiedDate = new Date(Number(timestamp));
  // Validate date
  if (isNaN(lastModifiedDate.getTime())) {
    return { valid: false, error: 'Invalid date derived from timestamp' };
  }
  // Validate date is in the past
  if (lastModifiedDate > new Date()) {
    return { valid: false, error: 'Timestamp cannot be in the future' };
  }
  return { valid: true, data: lastModifiedDate };
}

export function compareNames(fullNameObject, firstName, middleName, lastName) {
  if (!fullNameObject) return false;
  return fullNameObject.firstName === firstName && fullNameObject.middleName === middleName && fullNameObject.lastName === lastName;
}