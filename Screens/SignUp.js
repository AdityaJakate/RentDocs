import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView
} from 'react-native';
import axios from 'axios';

// Screen dimensions for responsive layouts
const { width } = Dimensions.get('window');

// Mock API calls (Replace these with your actual API calls)
const getDistrict = async (state) => {
  // Simulate API call
  return ['Pune', 'Nagpur'];
};

const getTaluka = async (state, district) => {
  // Simulate API call
  return ['Haveli', 'Mulshi'];
};

const getVillages = async (state, district, taluka) => {
  // Simulate API call
  return ['Village1', 'Village2'];
};

const checkMobileNumber = async (mobileNumber) => {
  // Simulate API call or check against a predefined list
  console.log("checkMobileNumber--->",mobileNumber);
  const response = await axios.post('http://10.31.97.91:9005/getUserExists', { id: mobileNumber });
  console.log("response-->",response.data.data.data);

  // Return true if mobile number is registered, otherwise false
  return response.data.data.data; // Assume mobile number is not registered
};

export default function SignUpScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [showStates, setShowStates] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [showTalukas, setShowTalukas] = useState(false);
  const [showVillages, setShowVillages] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    // Fetch states from API
    const fetchStates = async () => {
      // Replace with your actual API call
      setStates(['Maharashtra', 'Gujarat']);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    // Fetch districts when state changes
    if (selectedState) {
      const fetchDistricts = async () => {
        const fetchedDistricts = await getDistrict(selectedState);
        setDistricts(fetchedDistricts);
      };
      fetchDistricts();
    }
  }, [selectedState]);

  useEffect(() => {
    // Fetch talukas when district changes
    if (selectedDistrict) {
      const fetchTalukas = async () => {
        const fetchedTalukas = await getTaluka(selectedState, selectedDistrict);
        setTalukas(fetchedTalukas);
      };
      fetchTalukas();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    // Fetch villages when taluka changes
    if (selectedTaluka) {
      const fetchVillages = async () => {
        const fetchedVillages = await getVillages(selectedState, selectedDistrict, selectedTaluka);
        setVillages(fetchedVillages);
      };
      fetchVillages();
    }
  }, [selectedTaluka]);

  const renderDropdownItem = (item, onSelect) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.dropdownText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleSignUp = async () => {
    console.log("here--->")
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!/^\d{6}$/.test(password)) {
      Alert.alert('Error', 'Password must be 6 digits');
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    const isRegistered = await checkMobileNumber(mobileNumber);
    console.log("isRegistered--->",isRegistered)
    if (isRegistered) {
      Alert.alert('Warning', 'Mobile number already registered');
      // navigation.navigate('SignIn'); // Navigate to Sign-In Screen
      navigation.navigate('Login')
      return;
    }
    const response = await axios.post('http://10.31.97.91:9005/createUser', { id: mobileNumber,name:userName,password:password,state:selectedState, district:selectedDistrict,talukas:selectedTaluka,villages:selectedVillage});
    console.log("response-->",response.data);
    if(response.data.data.data){
      Alert.alert('Success', 'User Created .Please LogIn');
      setTimeout(() => {
        navigation.navigate('Login')

      }, 2000);



    } else{
      Alert.alert('Error', 'Something went wrong.Please try again');
    }
    // Simulate sending OTP and navigate to OTP screen
    // Alert.alert('Success', 'OTP has been sent to your mobile number');
    // navigation.navigate('OTPVerification'); // Navigate to OTP Verification Screen
  };

  return (
    <KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={100}
>
  <FlatList
    data={[]} // Empty array for main FlatList
    renderItem={null} // No rendering items directly
    ListHeaderComponent={
      <View style={styles.formContainer}>
        {/* User Name */}
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
        />

        {/* Mobile Number */}
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="numeric"
          maxLength={10}
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="6-Digit Password"
          value={password}
          onChangeText={setPassword}
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
        />

        {/* Confirm Password */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
        />

        {/* State Selector */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowStates(!showStates)}
        >
          <Text style={styles.dropdownLabel}>
            {selectedState || 'Select State'}
          </Text>
        </TouchableOpacity>
        {showStates && (
          <FlatList
            data={states}
            renderItem={({ item }) =>
              renderDropdownItem(item, (value) => {
                setSelectedState(value);
                setSelectedDistrict('');
                setSelectedTaluka('');
                setSelectedVillage('');
                setShowStates(false);
              })
            }
            keyExtractor={(item) => item}
            style={styles.dropdownList}
          />
        )}

        {/* District Selector */}
        {selectedState && (
          <>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowDistricts(!showDistricts)}
            >
              <Text style={styles.dropdownLabel}>
                {selectedDistrict || 'Select District'}
              </Text>
            </TouchableOpacity>
            {showDistricts && (
              <FlatList
                data={districts}
                renderItem={({ item }) =>
                  renderDropdownItem(item, (value) => {
                    setSelectedDistrict(value);
                    setSelectedTaluka('');
                    setSelectedVillage('');
                    setShowDistricts(false);
                  })
                }
                keyExtractor={(item) => item}
                style={styles.dropdownList}
              />
            )}
          </>
        )}

        {/* Taluka Selector */}
        {selectedDistrict && (
          <>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTalukas(!showTalukas)}
            >
              <Text style={styles.dropdownLabel}>
                {selectedTaluka || 'Select Taluka'}
              </Text>
            </TouchableOpacity>
            {showTalukas && (
              <FlatList
                data={talukas}
                renderItem={({ item }) =>
                  renderDropdownItem(item, (value) => {
                    setSelectedTaluka(value);
                    setSelectedVillage('');
                    setShowTalukas(false);
                  })
                }
                keyExtractor={(item) => item}
                style={styles.dropdownList}
              />
            )}
          </>
        )}

        {/* Village Selector */}
        {selectedTaluka && (
          <>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowVillages(!showVillages)}
            >
              <Text style={styles.dropdownLabel}>
                {selectedVillage || 'Select Village'}
              </Text>
            </TouchableOpacity>
            {showVillages && (
              <FlatList
                data={villages}
                renderItem={({ item }) =>
                  renderDropdownItem(item, (value) => {
                    setSelectedVillage(value);
                    setShowVillages(false);
                  })
                }
                keyExtractor={(item) => item}
                style={styles.dropdownList}
              />
            )}
          </>
        )}

        {/* Sign-Up Button */}
        <Button title="Sign Up" onPress={handleSignUp} />

        {/* Sign-In Option */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInButton}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    }
  />
</KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  dropdownLabel: {
    color: '#333',
  },
  dropdownList: {
    maxHeight: 150, // Limit height for dropdown
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    color: '#333',
  },
  signInContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    color: '#333',
  },
  signInButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
