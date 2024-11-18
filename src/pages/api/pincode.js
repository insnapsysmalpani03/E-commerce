import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { pincode } = req.body;  // Get pincode from request body

    // Check if pincode is provided
    if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
    }

    // Construct the path to the pincodes.json file
    const filePath = path.join(process.cwd(), 'public', 'pincodes.json');
    console.log(filePath)

    // Read the JSON file
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading file' });
      }

      // Parse the JSON data
      const pincodes = JSON.parse(data);

      // Find the pincode in the array
      const pincodeData = pincodes.find(
        (item) => item.pincode === parseInt(pincode, 10)
      );

      if (!pincodeData) {
        return res.status(404).json({ error: 'Pincode not found' });
      }

      // Return the districtName and stateName
      return res.status(200).json({
        districtName: pincodeData.districtName,
        stateName: pincodeData.stateName,
      });
    });
  } else {
    // Handle unsupported methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
