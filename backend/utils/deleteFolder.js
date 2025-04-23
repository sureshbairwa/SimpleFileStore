import fs from 'fs';

export const deleteFolder = async (folderPath) => {
  try {
    
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder does not exist: ${folderPath}`);
      return;
    }

    
          await fs.promises.rm(folderPath, { recursive: true });
          console.log(`Folder "${folderPath}" deleted successfully.`);
        
    
  } catch (error) {
    console.error(`Error deleting folder "${folderPath}":`, error);

  }
}