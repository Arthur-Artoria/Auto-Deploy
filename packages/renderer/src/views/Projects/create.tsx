import { Button } from '@mui/material';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

export function CreateProject() {
  const handleSelectProjectPath = useCallback(async () => {
    const data = await window.nodeCrypto.openFileExplorer();
    console.log(data);
  }, []);

  return (
    <div>
      <Link to="/">
        <Button>返回列表</Button>
      </Link>

      <Button variant="contained" onClick={handleSelectProjectPath}>
        选择项目地址
      </Button>
    </div>
  );
}
