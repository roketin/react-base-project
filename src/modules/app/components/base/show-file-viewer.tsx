import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import RFileViewer, {
  type TRFileViewer,
} from '@/modules/app/components/base/r-file-viewer';

export type TShowFileViewerConfig = Pick<TRFileViewer, 'src'> & {
  onClose?: () => void;
};

const showFileViewer = ({ src, onClose }: TShowFileViewerConfig) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = ReactDOM.createRoot(host);

  const cleanup = () => {
    root.unmount();
    host.remove();
  };

  const Component = () => {
    const [open, setOpen] = useState(true);

    const handleClose = useCallback(() => {
      setOpen(false);
      onClose?.();
    }, []);

    useEffect(() => {
      if (!open) {
        cleanup();
      }
    }, [open]);

    return <RFileViewer show={open} src={src} onClose={handleClose} />;
  };

  root.render(<Component />);
};

export default showFileViewer;
