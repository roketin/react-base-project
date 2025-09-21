/**
 * Note:
 * Delete component when app is ready to development
 */

import { Badge } from '@/modules/app/components/ui/badge';

const FileInfo = ({ src }: { src: string }) => {
  return (
    <div className=''>
      <i className='flex flex-col text-sm'>
        File Location:
        <Badge variant='destructive' className='inline-block mt-1'>
          {src}
        </Badge>
      </i>
    </div>
  );
};
export default FileInfo;
