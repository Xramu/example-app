import React, {useState} from 'react';
import {useContext} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {secondaryColor} from './ColorPalette';
import {useAuthentication} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';

const LoginForm = (props) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useAuthentication();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({defaultValues: {username: '', password: ''}});
  const [displayPassword, changeDisplayPassword] = useState(false);

  const logIn = async (loginData) => {
    console.log('Logging in!');
    console.log(loginData);
    try {
      const loginResult = await postLogin(loginData);
      console.log('LogIn, logIn', loginResult);
      await AsyncStorage.setItem('userToken', loginResult.token);
      setUser(loginResult.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('LogIn, logIn: ', error);
      // TODO: notify user about failed login
    }
  };

  return (
    <View>
      <Text>Login Form</Text>
      <Controller
        control={control}
        rules={{required: true, minLength: 3}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Username"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />
      {errors.username?.type === 'required' && (
        <Text>Username is required.</Text>
      )}
      {errors.username?.type === 'minLength' && (
        <Text>Username is too short.</Text>
      )}
      <Controller
        control={control}
        rules={{required: true, minLength: 5}}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Password"
            secureTextEntry={!displayPassword}
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && <Text>Password is too short.</Text>}
      <Button
        color={secondaryColor}
        title="Show Password"
        onPress={() => {
          changeDisplayPassword(!displayPassword);
        }}
      />
      <Button
        color={secondaryColor}
        title="Sign in"
        onPress={handleSubmit(logIn)}
      />
    </View>
  );
};

export default LoginForm;
