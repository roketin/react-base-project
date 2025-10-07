/**
 * Note:
 * Delete component when app is ready to development
 */

import { Badge } from '@/modules/app/components/ui/badge';
import { Label } from '@/modules/app/components/ui/label';

const FileInfo = ({ src }: { src: string }) => {
  return (
    <div className='inline-flex flex-col text-sm'>
      <Label className='uppercase text-gray-400 mb-1 text-sm'>
        File Location:
      </Label>
      <Badge variant='success' className='inline-block mt-1'>
        {src}
      </Badge>
    </div>
  );
};

export default FileInfo;
