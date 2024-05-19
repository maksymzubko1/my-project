import { useNavigation } from "@remix-run/react";

const useFormLoading = () => {
  const navigation = useNavigation();

  return navigation.formMethod !== 'GET' && navigation.state !== 'idle';
};

export default useFormLoading;