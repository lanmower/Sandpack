import readDirectoryRecursively from '../lib/readDirectory';
import path from 'path';
import SandpackExamples from '../components/SandpackExamples';

export default async function SandpackPage() {
  // Here, we need to resolve the correct path
  const directoryPath = path.join(process.cwd(), 'public', 'inside'); // Update to your directory
  const files = readDirectoryRecursively(directoryPath);
  console.log(files)
  return (
    <SandpackExamples initialFiles={files} />
  );
}