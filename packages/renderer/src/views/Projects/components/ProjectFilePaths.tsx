import Delete from '@mui/icons-material/Delete';
import { Button, FormControl, FormLabel, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AppTextField } from './AppTextField';
interface FilePathProperties {
  index: number;
  // onSelectPathClick: (index: number, type: 'openDirectory' | 'openFile') => Promise<string
  onDeleteClick: (index: number) => void;
}
function FilePath({ index, onDeleteClick }: FilePathProperties) {
  const name: `filePaths.${number}` = `filePaths.${index}`;
  return (
    <div className="flex items-center">
      <AppTextField
        name={name}
        textFieldProps={{
          className: 'flex-1',
          label: '文件路径'
        }}
      />
      <div className="ml-2 mt-2">
        <IconButton onClick={() => onDeleteClick(index)}>
          <Delete />
        </IconButton>
      </div>
    </div>
  );
}

/**
// TODO 文件路径选择
 * @returns 
 */
export function ProjectFilePaths() {
  const { getValues, setValue } = useFormContext<Project>();
  const [filePaths, _setFilePaths] = useState<string[]>(getValues('filePaths'));
  const setFilePaths = (filePaths: string[]) => {
    setValue('filePaths', filePaths);
    _setFilePaths(filePaths);
  };

  const handleSelectFilePath = async (type: 'openDirectory' | 'openFile') => {
    const projectPath = getValues('baseInfo.localPath');
    const { canceled, filePaths } = await window.nodeCrypto.openFileExplorer({
      defaultPath: projectPath,
      properties: [type, 'multiSelections']
    });

    if (canceled) return;
    const prevPaths = getValues('filePaths');
    const nextPaths = Array.from(new Set([...prevPaths, ...filePaths]));

    setFilePaths(nextPaths);
  };

  const handleDeleteClick = (filePathIndex: number) => {
    const newFilePaths = filePaths.filter(
      (_, index) => index !== filePathIndex
    );

    setFilePaths(newFilePaths);
  };

  return (
    <FormControl margin="normal" fullWidth>
      <div className="flex justify-between items-center">
        <FormLabel>请填写待上传文件路径</FormLabel>
        <div className="space-x-2">
          <Button
            onClick={() => handleSelectFilePath('openFile')}
            variant="outlined"
          >
            选择文件
          </Button>
          <Button
            onClick={() => handleSelectFilePath('openDirectory')}
            variant="outlined"
          >
            选择文件夹
          </Button>
        </div>
      </div>

      {filePaths.map((_path, index) => (
        <FilePath index={index} key={_path} onDeleteClick={handleDeleteClick} />
      ))}
    </FormControl>
  );
}
