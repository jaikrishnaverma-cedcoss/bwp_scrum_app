import React, {
  ButtonHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from "react";
import { DI, DIProps, parseJwt, extractUSername } from "../../../Core";
import { loginStatus } from "../../../Actions";
import * as queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { StoreDispatcher } from "../../..";
import { Eye, EyeOff, ArrowLeft } from "react-feather";
import {
  Button,
  FlexLayout,
  FormElement,
  RightArrow,
  TextField,
} from "@cedcommerce/ounce-ui";
import {
  APP_SOURCE_NAME,
  regexValidation,
  urlFetchCalls,
} from "../../../Constant";
import { RegistrationPage } from "../StaticMessages";

interface PropsI extends DIProps {
  loginStatus: () => void;
}
interface objIErrorValidate {
  error?: boolean;
  message?: string;
  showError?: boolean;
}
interface objectState {
  [name: string]: objIErrorValidate;
}
interface loginStateObj {
  username: string;
  password: string;
  loading: boolean;
  eyeoff: boolean;
}
function ForgotPassword(_props: PropsI): JSX.Element {
  const {
    di: { POST },
    success,
    error,
  } = _props;
  const [state, setState] = useState<loginStateObj>({
    username: "",
    password: "",
    loading: false,
    eyeoff: false,
  });
  const [pageLoad, pageLoadingState] = useState<boolean>(true);
  const [errorValidation, setErrorValidation] = useState<objectState>({
    email: { error: true, message: "", showError: false },
    password: { error: true, showError: false },
  });
  const navigate = useNavigate();
  const dispatcher = useContext(StoreDispatcher);

  useEffect(() => {
    dispatcher({
      type: "logout",
      state: {},
    });
    _props.di.globalState.removeLocalStorage("auth_token");
    pageLoadingState(false);
    return () => {};
  }, []);
  const submitHandler = () => {
    setState({ ...state, loading: true });
    let res = POST(
      "user/forgot",
      {
        email: state.username,
        "reset-link": `http://localhost:6502/auth/reset`,
        "target_marketplace": "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
        "subject":"Reset your password for Social Ads on Buy with Prime Account"
      }
    ).then(res=>{
      if(res.success){
      success(res.message);
      setState({ ...state, loading: false });
    }else{
      
    }
    });
  };

  const validate = (inputName: string) => {
    if (inputName === "username") {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.username))
        setErrorValidation({
          ...errorValidation,
          email: { error: false, message: " ", showError: false },
        });
      else
        setErrorValidation({
          ...errorValidation,
          email: {
            error: true,
            message: "Please enter correct email address.",
            showError: true,
          },
        });
    }
  };

  if (pageLoad) {
    return <></>;
  }

  const { username, loading } = state;

  return (
    <>
      <FormElement>
        <TextField
          error={errorValidation.email.showError}
          showHelp={errorValidation.email.message}
          required={true}
          placeHolder={"Enter Email"}
          onblur={() => validate("username")}
          onChange={(e) => setState({ ...state, username: e })}
          value={username}
        />
        <div></div>
        <hr />
        <Button
          thickness="large"
          length="fullBtn"
          loading={loading}
          disable={errorValidation.email.error}
          onClick={submitHandler}
        >
          Generate link
        </Button>
        <Button
          icon={<ArrowLeft />}
          onClick={() => _props.history("/auth/login")}
          content="Back to login"
          type="Plain"
        />
      </FormElement>
    </>
  );
}

export default DI(ForgotPassword, { func: { loginStatus } });
