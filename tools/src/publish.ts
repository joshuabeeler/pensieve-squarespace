import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { Client } from 'basic-ftp';

dotenv.config();

interface PublishSpec {
  files: string[];
}

async function uploadFiles(specPath = 'publish.yaml') {
  const content = fs.readFileSync(specPath, 'utf8');
  const spec = yaml.load(content) as PublishSpec;

  const client = new Client();
  client.ftp.verbose = false;

  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const pass = process.env.FTP_PASS;
  const remoteBase = process.env.FTP_BASE || '/';

  if (!host || !user || !pass) {
    console.error('Missing FTP credentials in .env (FTP_HOST, FTP_USER, FTP_PASS)');
    process.exit(1);
  }

  try {
    await client.access({ host, user, password: pass });
    for (const file of spec.files) {
      const localPath = path.resolve(file);
      if (!fs.existsSync(localPath)) {
        console.warn(`Skipping missing file: ${localPath}`);
        continue;
      }
      const remotePath = path.posix.join(remoteBase, path.basename(file));
      console.log(`Uploading ${localPath} -> ${remotePath}`);
      await client.uploadFrom(localPath, remotePath);
    }
  } catch (err) {
    console.error('Upload failed:', err);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

if (require.main === module) {
  const spec = process.argv[2] || 'publish.yaml';
  uploadFiles(spec).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export default uploadFiles;
