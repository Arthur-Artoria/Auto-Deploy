import { Button, FormControl, FormLabel } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AppTextField } from './AppTextField';

interface FilePathProperties {
  index: number;
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

      <Button className="ml-2" onClick={() => onDeleteClick(index)}>
        删除
      </Button>
    </div>
  );
}

/**
// TODO 文件路径选择
 * @returns 
 */
export function ProjectFilePaths() {
  const { getValues, setValue } = useFormContext<Project>();
  const filePaths = getValues('filePaths');

  const handleSelectFilePath = async (type: 'openDirectory' | 'openFile') => {
    const defaultPath = getValues('baseInfo.localPath');
    const data = await window.nodeCrypto.openFileExplorer({
      defaultPath,
      properties: [type, 'multiSelections']
    });
    const projectPath = data.filePaths[0] || '';
    console.log(projectPath);
    // setValue(name, projectPath);
  };

  const handleDeleteClick = (filePathIndex: number) => {
    const newFilePaths = filePaths.filter(
      (_, index) => index !== filePathIndex
    );

    setValue('filePaths', newFilePaths);
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
        <FilePath index={index} key={index} onDeleteClick={handleDeleteClick} />
      ))}
    </FormControl>
  );
}
