import React, { ChangeEvent, ForwardedRef, useEffect, useState, useRef } from 'react';
import { FileType } from '../../types';

import ImageIcon from '../../assets/icons/Icons=Image.svg';
import FileIcon from '../../assets/icons/Icons=File.svg';
import SuccessIcon from '../../assets/icons/Icons=Check.svg';
import DeclineIcon from '../../assets/icons/Icons=Times.svg';
import InfoCircle from '../../assets/icons/Icons=Info-Cirlce.svg';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  className?: string;
  onFileUpload?: (files: File[]) => Promise<void>;
  onFileDelete: (id: string) => Promise<void>;
  value: FileType[] | File[];
  originalFiles?: File[];
  setOriginalFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  extension: 'images' | 'docs' | 'files';
  error?: string;
  helperMessage?: string;
}

const FileUpload = (
  {
    className,
    onFileUpload,
    onFileDelete,
    originalFiles,
    setOriginalFiles,
    extension,
    error,
    helperMessage,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [files, setFiles] = useState<FileType[]>((props.value as unknown as FileType[]) || []);
  const [progress, setProgress] = useState<number>(0);
  const fileRef = useRef<HTMLInputElement>();
  const [err, setErr] = useState<string>(error);

  useEffect(() => {
    setFiles(props.value as FileType[]);
  }, [props.value]);

  const handleFileBrowser = () => {
    fileRef.current.click();
  };

  function uploadProgress(totalSize: number) {
    let loaded = 0;

    const uploadInterval = setInterval(() => {
      if (totalSize <= 1000) {
        loaded += 200;
      } else if (totalSize <= 1000000) {
        loaded += 50000;
      } else {
        loaded += 10000000;
      }

      const percentage = (loaded / totalSize) * 100;
      setProgress(percentage);

      if (loaded >= totalSize) {
        clearInterval(uploadInterval);
      }
    }, 500);
  }

  const filesValidation = (file: File) => {
    if (file.size === 0) {
      setErr('The total size per file must be more than 0KB.');
      return false;
    }

    if (extension === 'images') {
      if (
        file?.type !== 'image/gif' &&
        file?.type !== 'image/jpeg' &&
        file?.type !== 'image/png' &&
        file?.type !== 'image/jpg'
      ) {
        setErr('Please enter valid image format.');
        return false;
      }

      if (file.size > 3000000 && extension === 'images') {
        setErr('The total size per image must be less than 3MB.');
        return false;
      }
    } else if (extension === 'docs') {
      if (
        file?.type !== 'application/pdf' &&
        file?.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        setErr('Please enter valid document format.');
        return false;
      }
    }

    const fileNames = originalFiles.map((item) => item.name).concat(files.map((item) => item.originalName));
    const findFile = !!fileNames.find((value) => value === file.name);

    if (findFile) {
      setErr(`The same ${extension === 'images' ? 'image' : 'document'} can’t be uploaded`);
      return false;
    }

    return true;
  };

  const handleDrop = async (event: React.DragEvent<HTMLLabelElement>): Promise<void> => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newFiles: File[] = [];
    let totalSize = 0;

    for (const file of droppedFiles) {
      if (file?.name) {
        if (!filesValidation(file)) return;
        newFiles.push(file);
      }
    }

    for (const newFile of newFiles) {
      totalSize += newFile.size;
    }

    for (const file of files) {
      totalSize += file.size;
    }

    for (const file of originalFiles) {
      totalSize += file.size;
    }

    const totalCnt = newFiles.length + files.length + originalFiles.length;

    if (totalCnt > 5) {
      setErr(`You can only upload 5 ${extension === 'images' ? 'images' : 'documents'}.`);
      return;
    }

    setErr('');

    if (onFileUpload) {
      await onFileUpload(newFiles);
    }

    if (setOriginalFiles) {
      setOriginalFiles((prevFiles: File[]) => [...prevFiles, ...newFiles]);
    }

    uploadProgress(totalSize);
    fileRef.current.value = null;
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files.length) {
      const selectedFile = event.target.files;
      let totalSize = 0;
      const newFiles: File[] = [];

      for (const file of selectedFile) {
        if (!filesValidation(file)) return;
        totalSize += file.size;
        newFiles.push(file);
      }

      for (const file of files) {
        totalSize += file.size;
      }

      for (const file of originalFiles) {
        totalSize += file.size;
      }

      const totalCnt = selectedFile.length + files.length + originalFiles.length;

      if (totalCnt > 5) {
        setErr(`You can only upload 5 ${extension === 'images' ? 'images' : 'documents'}.`);
        return;
      }

      setErr('');

      if (onFileUpload) {
        await onFileUpload(event.target.files as unknown as File[]);
      }

      if (setOriginalFiles) {
        setOriginalFiles((prevFile) => [...prevFile, ...newFiles]);
      }

      uploadProgress(totalSize);
      fileRef.current.value = null;
    }
  };

  const handleDeleteFile = async (event: React.MouseEvent<HTMLDivElement>, fileId: string) => {
    event.preventDefault();
    await onFileDelete(fileId);

    if (files?.length === 0) setProgress(0);
  };

  const handleOriginalDeleteFile = (name: string) => {
    setErr('');
    fileRef.current.value = null;
    const filterOriginal = originalFiles.filter((rs: File) => rs.name !== name);

    if (setOriginalFiles) setOriginalFiles(filterOriginal);
    if (filterOriginal?.length === 0) setProgress(0);
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        className={`${err ? 'border-state-error focus:border-state-error' : ''} hidden`}
        onChange={handleFileInputChange}
        multiple
      />
      <label
        className={`border-2 border-dashed border-[#86ABD1] flex items-center flex-col justify-center bg-[#F6FBFF] ${
          className || ''
        }`}
        onDrop={(event) => void handleDrop(event)}
        onDragOver={(event) => handleDragOver(event)}
      >
        <div className="flex items-center justify-center gap-4 p-7 w-full cursor-pointer" onClick={handleFileBrowser}>
          {extension === 'images' ? (
            <div>
              <ImageIcon className="fill-main-primary scale-[1.4]" />
            </div>
          ) : (
            <div>
              <FileIcon className="scale-[1.4]" />
            </div>
          )}

          <p>
            Drag & drop or <span className="text-main-primary font-bold">Browse</span>
          </p>
        </div>

        {(files?.length !== 0 || originalFiles?.length !== 0) && (
          <div className="w-[95%] border-t-[#CDD6EC] border-t-[1px]">
            {files?.[0]?.id && (
              <>
                {files?.map((item) => (
                  <div key={item.id} className="flex justify-between w-full py-7 items-center">
                    <div className="flex gap-10 items-center">
                      <div>
                        <SuccessIcon className="fill-main-secondary" />
                      </div>
                      <p className="font-bold max-w-[170px] break-words sm:max-w-[300px]">{item.originalName}</p>
                    </div>
                    <div className="hover:cursor-pointer" onClick={(event) => void handleDeleteFile(event, item.id)}>
                      <DeclineIcon className="fill-main-secondary" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {originalFiles?.map((rs: File, key: number) => (
              <div key={key} className="flex justify-between w-full py-7 items-center">
                <div className="flex gap-10 items-center">
                  <div>
                    <SuccessIcon className="fill-main-secondary" />
                  </div>
                  <p className="font-bold max-w-[170px] break-words sm:max-w-[300px]">{rs.name}</p>
                </div>
                <div className="hover:cursor-pointer" onClick={() => void handleOriginalDeleteFile(rs.name)}>
                  <DeclineIcon className="fill-main-secondary" />
                </div>
              </div>
            ))}

            {progress > 0 && (
              <div className="h-1 w-full mb-3 relative bg-[#E1E6ED]">
                <div
                  style={{ width: `${progress}%` }}
                  className={`absolute h-full bg-main-primary w-[${progress}%] max-w-full`}
                ></div>
              </div>
            )}
          </div>
        )}
      </label>

      {error && <p className="text-state-error mb-0">* {error}</p>}
      {err && <p className="text-state-error mb-0">* {err}</p>}

      {helperMessage && (
        <div className="flex gap-2 items-center mt-2">
          <div>
            <InfoCircle className="fill-main-primary" />
          </div>
          <p className="text-label-disable text-sm">{helperMessage}</p>
        </div>
      )}
    </>
  );
};

export default React.forwardRef(FileUpload);
