import * as SQLite from 'expo-sqlite';

// Open the database
const db = SQLite.openDatabaseAsync('leaf_detection.db');

interface SQLResultSet {
  insertId?: number;
  rowsAffected: number;
  rows: {
    _array: any[];
    length: number;
    item: (index: number) => any;
  };
}

interface SQLTransaction {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: SQLTransaction, error: Error) => boolean
  ) => void;
}

interface DetectionRow {
  id: number;
  image_uri: string;
  disease_name: string;
  confidence: number;
  timestamp: string;
  status: string;
}

// Initialize the database
export const initDatabase = async () => {
  try {
    const database = await db;
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS detection_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_uri TEXT,
        disease_name TEXT,
        confidence REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT
      )`
    );
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Save a new detection
export const saveDetection = async (imageUri: string, diseaseName: string, confidence: number, status: string) => {
  try {
    const database = await db;
    const sql = `INSERT INTO detection_history (image_uri, disease_name, confidence, status) 
                 VALUES ('${imageUri}', '${diseaseName}', ${confidence}, '${status}')`;
    console.log('Executing SQL:', sql);
    await database.execAsync(sql);
    console.log('Detection saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving detection:', error);
    throw error;
  }
};

// Get all detections
export const getDetections = async () => {
  try {
    const database = await db;
    const sql = 'SELECT * FROM detection_history ORDER BY timestamp DESC';
    console.log('Executing SQL:', sql);
    
    const result = await database.getAllAsync(sql);
    console.log('Raw result:', result);
    
    if (!result || !Array.isArray(result)) {
      console.log('No results found or invalid result format');
      return [];
    }

    const detections = result.map((row: unknown) => {
      const typedRow = row as DetectionRow;
      return {
        id: typedRow.id,
        image_uri: typedRow.image_uri,
        disease_name: typedRow.disease_name,
        confidence: typedRow.confidence,
        timestamp: typedRow.timestamp,
        status: typedRow.status
      };
    });
    
    console.log('Retrieved detections:', detections);
    return detections;
  } catch (error) {
    console.error('Error getting detections:', error);
    return [];
  }
};

// Delete a detection
export const deleteDetection = async (id: number) => {
  try {
    const database = await db;
    const sql = `DELETE FROM detection_history WHERE id = ${id}`;
    await database.execAsync(sql);
    return true;
  } catch (error) {
    console.error('Error deleting detection:', error);
    throw error;
  }
}; 