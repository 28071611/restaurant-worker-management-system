import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Users,
  ChefHat,
  Utensils,
  Shield
} from 'lucide-react';

const DatasetSeeder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // 100 workers dataset with different departments
  const workersDataset = [
    {"name":"Ravi Kumar","role":"Chef","salary":18000,"shift":"Morning","phone":"9876500001","department":"Kitchen","experience":5},
    {"name":"Arun Prakash","role":"Waiter","salary":9000,"shift":"Evening","phone":"9876500002","department":"Service","experience":2},
    {"name":"Suresh Babu","role":"Cleaner","salary":7000,"shift":"Morning","phone":"9876500003","department":"Maintenance","experience":3},
    {"name":"Vijay Raj","role":"Manager","salary":25000,"shift":"Full","phone":"9876500004","department":"Management","experience":8},
    {"name":"Karthik","role":"Chef","salary":20000,"shift":"Evening","phone":"9876500005","department":"Kitchen","experience":6},
    {"name":"Manoj","role":"Waiter","salary":8500,"shift":"Morning","phone":"9876500006","department":"Service","experience":2},
    {"name":"Deepak","role":"Cleaner","salary":7200,"shift":"Evening","phone":"9876500007","department":"Maintenance","experience":1},
    {"name":"Ajith","role":"Chef","salary":22000,"shift":"Morning","phone":"9876500008","department":"Kitchen","experience":7},
    {"name":"Praveen","role":"Cashier","salary":12000,"shift":"Full","phone":"9876500009","department":"Billing","experience":3},
    {"name":"Santhosh","role":"Security","salary":8000,"shift":"Night","phone":"9876500010","department":"Security","experience":4},
    {"name":"Gokul","role":"Waiter","salary":8800,"shift":"Evening","phone":"9876500011","department":"Service","experience":2},
    {"name":"Naveen","role":"Chef","salary":21000,"shift":"Morning","phone":"9876500012","department":"Kitchen","experience":6},
    {"name":"Hari","role":"Cleaner","salary":7500,"shift":"Morning","phone":"9876500013","department":"Maintenance","experience":3},
    {"name":"Ramesh","role":"Manager","salary":26000,"shift":"Full","phone":"9876500014","department":"Management","experience":9},
    {"name":"Kiran","role":"Cashier","salary":11500,"shift":"Evening","phone":"9876500015","department":"Billing","experience":2},
    {"name":"Dinesh","role":"Chef","salary":19500,"shift":"Morning","phone":"9876500016","department":"Kitchen","experience":5},
    {"name":"Vignesh","role":"Waiter","salary":8700,"shift":"Evening","phone":"9876500017","department":"Service","experience":3},
    {"name":"Saravanan","role":"Cleaner","salary":7100,"shift":"Morning","phone":"9876500018","department":"Maintenance","experience":2},
    {"name":"Anand","role":"Security","salary":8200,"shift":"Night","phone":"9876500019","department":"Security","experience":4},
    {"name":"Murugan","role":"Chef","salary":23000,"shift":"Evening","phone":"9876500020","department":"Kitchen","experience":8},
    {"name":"Lokesh","role":"Waiter","salary":8600,"shift":"Morning","phone":"9876500021","department":"Service","experience":2},
    {"name":"Bala","role":"Cleaner","salary":7300,"shift":"Evening","phone":"9876500022","department":"Maintenance","experience":3},
    {"name":"Rajesh","role":"Chef","salary":20500,"shift":"Morning","phone":"9876500023","department":"Kitchen","experience":6},
    {"name":"Sathish","role":"Cashier","salary":12500,"shift":"Full","phone":"9876500024","department":"Billing","experience":4},
    {"name":"Prakash","role":"Security","salary":8100,"shift":"Night","phone":"9876500025","department":"Security","experience":3},
    {"name":"Ashok","role":"Chef","salary":21500,"shift":"Morning","phone":"9876500026","department":"Kitchen","experience":7},
    {"name":"Kumaravel","role":"Waiter","salary":8900,"shift":"Evening","phone":"9876500027","department":"Service","experience":3},
    {"name":"Selvam","role":"Cleaner","salary":7400,"shift":"Morning","phone":"9876500028","department":"Maintenance","experience":2},
    {"name":"Rohit","role":"Manager","salary":27000,"shift":"Full","phone":"9876500029","department":"Management","experience":10},
    {"name":"Rahul","role":"Cashier","salary":13000,"shift":"Evening","phone":"9876500030","department":"Billing","experience":5},
    {"name":"Sanjay","role":"Chef","salary":22500,"shift":"Morning","phone":"9876500031","department":"Kitchen","experience":7},
    {"name":"Kishore","role":"Waiter","salary":9100,"shift":"Evening","phone":"9876500032","department":"Service","experience":3},
    {"name":"Mohan","role":"Cleaner","salary":7600,"shift":"Morning","phone":"9876500033","department":"Maintenance","experience":4},
    {"name":"Varun","role":"Security","salary":8300,"shift":"Night","phone":"9876500034","department":"Security","experience":3},
    {"name":"Aravind","role":"Chef","salary":24000,"shift":"Evening","phone":"9876500035","department":"Kitchen","experience":9},
    {"name":"Yogesh","role":"Waiter","salary":8800,"shift":"Morning","phone":"9876500036","department":"Service","experience":2},
    {"name":"Thiru","role":"Cleaner","salary":7200,"shift":"Evening","phone":"9876500037","department":"Maintenance","experience":2},
    {"name":"Bharath","role":"Chef","salary":21000,"shift":"Morning","phone":"9876500038","department":"Kitchen","experience":6},
    {"name":"Ganesh","role":"Cashier","salary":12000,"shift":"Full","phone":"9876500039","department":"Billing","experience":3},
    {"name":"Karthi","role":"Security","salary":8500,"shift":"Night","phone":"9876500040","department":"Security","experience":5},
    {"name":"Vinod","role":"Chef","salary":22000,"shift":"Morning","phone":"9876500041","department":"Kitchen","experience":7},
    {"name":"Arjun","role":"Waiter","salary":8700,"shift":"Evening","phone":"9876500042","department":"Service","experience":3},
    {"name":"Siva","role":"Cleaner","salary":7000,"shift":"Morning","phone":"9876500043","department":"Maintenance","experience":1},
    {"name":"Dharani","role":"Manager","salary":26000,"shift":"Full","phone":"9876500044","department":"Management","experience":8},
    {"name":"Karthikeya","role":"Cashier","salary":12500,"shift":"Evening","phone":"9876500045","department":"Billing","experience":4},
    {"name":"Nithin","role":"Chef","salary":23000,"shift":"Morning","phone":"9876500046","department":"Kitchen","experience":8},
    {"name":"Harish","role":"Waiter","salary":9000,"shift":"Evening","phone":"9876500047","department":"Service","experience":2},
    {"name":"Ragul","role":"Cleaner","salary":7400,"shift":"Morning","phone":"9876500048","department":"Maintenance","experience":3},
    {"name":"Vasu","role":"Security","salary":8200,"shift":"Night","phone":"9876500049","department":"Security","experience":4},
    {"name":"Manikandan","role":"Chef","salary":25000,"shift":"Evening","phone":"9876500050","department":"Kitchen","experience":10},
    {"name":"Siddharth","role":"Waiter","salary":9200,"shift":"Morning","phone":"9876500051","department":"Service","experience":3},
    {"name":"Karthikeyan","role":"Cleaner","salary":7700,"shift":"Evening","phone":"9876500052","department":"Maintenance","experience":2},
    {"name":"Vikram","role":"Manager","salary":28000,"shift":"Full","phone":"9876500053","department":"Management","experience":12},
    {"name":"Abhishek","role":"Cashier","salary":13500,"shift":"Full","phone":"9876500054","department":"Billing","experience":5},
    {"name":"Rohit Sharma","role":"Security","salary":8600,"shift":"Night","phone":"9876500055","department":"Security","experience":6},
    {"name":"Amit Kumar","role":"Chef","salary":23500,"shift":"Morning","phone":"9876500056","department":"Kitchen","experience":9},
    {"name":"Praveen Kumar","role":"Waiter","salary":9300,"shift":"Evening","phone":"9876500057","department":"Service","experience":4},
    {"name":"Murali","role":"Cleaner","salary":7800,"shift":"Morning","phone":"9876500058","department":"Maintenance","experience":3},
    {"name":"Sundar","role":"Chef","salary":24500,"shift":"Evening","phone":"9876500059","department":"Kitchen","experience":11},
    {"name":"Madhavan","role":"Waiter","salary":9400,"shift":"Morning","phone":"9876500060","department":"Service","experience":3},
    {"name":"Kalyan","role":"Cleaner","salary":7900,"shift":"Evening","phone":"9876500061","department":"Maintenance","experience":4},
    {"name":"Vijay Kumar","role":"Manager","salary":29000,"shift":"Full","phone":"9876500062","department":"Management","experience":15},
    {"name":"Ajay Kumar","role":"Cashier","salary":14000,"shift":"Full","phone":"9876500063","department":"Billing","experience":6},
    {"name":"Naveen Kumar","role":"Security","salary":8700,"shift":"Night","phone":"9876500064","department":"Security","experience":5},
    {"name":"Anand Kumar","role":"Chef","salary":25000,"shift":"Morning","phone":"9876500065","department":"Kitchen","experience":10},
    {"name":"Raj Kumar","role":"Waiter","salary":9500,"shift":"Evening","phone":"9876500066","department":"Service","experience":4},
    {"name":"Suresh Kumar","role":"Cleaner","salary":8000,"shift":"Morning","phone":"9876500067","department":"Maintenance","experience":3},
    {"name":"Mohan Kumar","role":"Chef","salary":26000,"shift":"Evening","phone":"9876500068","department":"Kitchen","experience":12},
    {"name":"Vikram Kumar","role":"Waiter","salary":9600,"shift":"Morning","phone":"9876500069","department":"Service","experience":5},
    {"name":"Karthik Kumar","role":"Cleaner","salary":8100,"shift":"Evening","phone":"9876500070","department":"Maintenance","experience":4},
    {"name":"Arun Kumar","role":"Manager","salary":30000,"shift":"Full","phone":"9876500071","department":"Management","experience":18},
    {"name":"Deepak Kumar","role":"Cashier","salary":14500,"shift":"Full","phone":"9876500072","department":"Billing","experience":7},
    {"name":"Prakash Kumar","role":"Security","salary":8800,"shift":"Night","phone":"9876500073","department":"Security","experience":6},
    {"name":"Ashok Kumar","role":"Chef","salary":27000,"shift":"Morning","phone":"9876500074","department":"Kitchen","experience":14},
    {"name":"Ramesh Kumar","role":"Waiter","salary":9700,"shift":"Evening","phone":"9876500075","department":"Service","experience":5},
    {"name":"Sathish Kumar","role":"Cleaner","salary":8200,"shift":"Morning","phone":"9876500076","department":"Maintenance","experience":4},
    {"name":"Sanjay Kumar","role":"Chef","salary":28000,"shift":"Evening","phone":"9876500077","department":"Kitchen","experience":16},
    {"name":"Kishore Kumar","role":"Waiter","salary":9800,"shift":"Morning","phone":"9876500078","department":"Service","experience":6},
    {"name":"Mohan Kumar","role":"Cleaner","salary":8300,"shift":"Evening","phone":"9876500079","department":"Maintenance","experience":5},
    {"name":"Varun Kumar","role":"Manager","salary":32000,"shift":"Full","phone":"9876500080","department":"Management","experience":20},
    {"name":"Aravind Kumar","role":"Cashier","salary":15000,"shift":"Full","phone":"9876500081","department":"Billing","experience":8},
    {"name":"Yogesh Kumar","role":"Security","salary":8900,"shift":"Night","phone":"9876500082","department":"Security","experience":7},
    {"name":"Thiru Kumar","role":"Chef","salary":29000,"shift":"Morning","phone":"9876500083","department":"Kitchen","experience":18},
    {"name":"Bharath Kumar","role":"Waiter","salary":9900,"shift":"Evening","phone":"9876500084","department":"Service","experience":7},
    {"name":"Ganesh Kumar","role":"Cleaner","salary":8400,"shift":"Morning","phone":"9876500085","department":"Maintenance","experience":6},
    {"name":"Karthi Kumar","role":"Chef","salary":30000,"shift":"Evening","phone":"9876500086","department":"Kitchen","experience":20},
    {"name":"Vinod Kumar","role":"Waiter","salary":10000,"shift":"Morning","phone":"9876500087","department":"Service","experience":8},
    {"name":"Arjun Kumar","role":"Cleaner","salary":8500,"shift":"Evening","phone":"9876500088","department":"Maintenance","experience":5},
    {"name":"Siva Kumar","role":"Manager","salary":35000,"shift":"Full","phone":"9876500089","department":"Management","experience":25},
    {"name":"Dharani Kumar","role":"Cashier","salary":15500,"shift":"Full","phone":"9876500090","department":"Billing","experience":9},
    {"name":"Karthikeya Kumar","role":"Security","salary":9000,"shift":"Night","phone":"9876500091","department":"Security","experience":8},
    {"name":"Nithin Kumar","role":"Chef","salary":31000,"shift":"Morning","phone":"9876500092","department":"Kitchen","experience":22},
    {"name":"Harish Kumar","role":"Waiter","salary":10100,"shift":"Evening","phone":"9876500093","department":"Service","experience":9},
    {"name":"Ragul Kumar","role":"Cleaner","salary":8600,"shift":"Morning","phone":"9876500094","department":"Maintenance","experience":7},
    {"name":"Vasu Kumar","role":"Chef","salary":32000,"shift":"Evening","phone":"9876500095","department":"Kitchen","experience":24},
    {"name":"Manikandan Kumar","role":"Waiter","salary":10200,"shift":"Morning","phone":"9876500096","department":"Service","experience":10},
    {"name":"Siddharth Kumar","role":"Cleaner","salary":8700,"shift":"Evening","phone":"9876500097","department":"Maintenance","experience":6},
    {"name":"Karthikeyan Kumar","role":"Manager","salary":38000,"shift":"Full","phone":"9876500098","department":"Management","experience":30},
    {"name":"Vijay Kumar","role":"Cashier","salary":16000,"shift":"Full","phone":"9876500099","department":"Billing","experience":10},
    {"name":"Abhishek Kumar","role":"Security","salary":9100,"shift":"Night","phone":"9876500100","department":"Security","experience":9}
  ];

  const seedDatabase = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/workers/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workers: workersDataset })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Successfully seeded 100 workers to the database!');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to seed database');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error connecting to server');
      setMessageType('error');
    }
    
    setLoading(false);
  };

  const downloadDataset = () => {
    const dataStr = JSON.stringify(workersDataset, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'restaurant_workers_dataset.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getDepartmentStats = () => {
    const stats = {};
    workersDataset.forEach(worker => {
      stats[worker.department] = (stats[worker.department] || 0) + 1;
    });
    return stats;
  };

  const departmentStats = getDepartmentStats();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Seeder</h1>
              <p className="text-gray-600">Populate your database with 100 sample workers</p>
            </div>
          </div>
        </div>

        {/* Dataset Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{workersDataset.length}</div>
            <div className="text-sm text-blue-600">Total Workers</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <ChefHat className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{departmentStats.Kitchen || 0}</div>
            <div className="text-sm text-green-600">Kitchen Staff</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Utensils className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{departmentStats.Service || 0}</div>
            <div className="text-sm text-purple-600">Service Staff</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-900">{departmentStats.Security || 0}</div>
            <div className="text-sm text-orange-600">Security Staff</div>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(departmentStats).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-sm font-medium text-gray-700">{dept}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={seedDatabase}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Seed Database</span>
              </>
            )}
          </button>
          
          <button
            onClick={downloadDataset}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            <Download className="h-5 w-5" />
            <span>Download Dataset</span>
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`rounded-lg p-4 flex items-center space-x-2 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <p className={`text-sm ${
              messageType === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click "Seed Database" to populate MongoDB with 100 workers</li>
            <li>• Click "Download Dataset" to get the JSON file</li>
            <li>• Workers are distributed across 6 different departments</li>
            <li>• Each worker has realistic salary and experience data</li>
            <li>• Use Ctrl+Shift+A to access admin dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatasetSeeder;
