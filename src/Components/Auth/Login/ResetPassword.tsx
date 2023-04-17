import React, {
  ButtonHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from "react";
import { DI, DIProps, parseJwt, extractUSername } from "../../../Core";
import CustomHelpPpoints from '../../CustomHelpPoints'
import { loginStatus } from "../../../Actions";
import * as queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { StoreDispatcher } from "../../..";
import { Eye, EyeOff, ArrowLeft } from "react-feather";
import {
  Button,
  FlexLayout,
  FormElement,
  List,
  RightArrow,
  TextField,
  TextStyles,
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
  confirmPassword: string;
  password: string;
  loading: boolean;
  eyeoff: boolean;
}
function ResetPassword(_props: PropsI): JSX.Element {
  const [state, setState] = useState<loginStateObj>({
    confirmPassword: "",
    password: "",
    loading: false,
    eyeoff: false,
  });
  const [pageLoad, pageLoadingState] = useState<boolean>(true);
  const [errorValidation, setErrorValidation] = useState<objectState>({
    confirmPassword: { error: true, message: "", showError: false },
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

  const submitHandler = async () => {
    setState({ ...state, loading: true });
  };

  const validate = (inputName: string) => {
    if (inputName === "password") {
      if (
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
          state.password
        )
      )
        setErrorValidation({
          ...errorValidation,
          password: { error: false, message: " ", showError: false },
        });
      else
        setErrorValidation({
          ...errorValidation,
          password: {
            error: true,
            message:
              "password not match with given requirements.",
            showError: true,
          },
        });
    }
    if (inputName === "confirmPassword") {
      if (state.confirmPassword === state.password)
        setErrorValidation({
          ...errorValidation,
          confirmPassword: { error: false, message: " ", showError: false },
        });
      else
        setErrorValidation({
          ...errorValidation,
          confirmPassword: {
            error: true,
            message: "password & confirm password did't match.",
            showError: true,
          },
        });
    }
  };

  if (pageLoad) {
    return <></>;
  }

  const { loading, password, confirmPassword } = state;

  return (
    <>
      <FormElement>
        <TextField
          show={state.eyeoff}
          type="password"
          innerSufIcon={
            state.eyeoff ? (
              <Eye
                color="#3B424F"
                size={20}
                onClick={() =>
                  setState({
                    ...state,
                    eyeoff: !state.eyeoff,
                  })
                }
              />
            ) : (
              <EyeOff
                color="#3B424F"
                size={20}
                onClick={() =>
                  setState({
                    ...state,
                    eyeoff: !state.eyeoff,
                  })
                }
              />
            )
          }
          name="New Password"
          error={errorValidation.password.showError}
          showHelp={errorValidation.password.message}
          required={true}
          placeHolder={"Enter New password"}
          onblur={() => validate("password")}
          onChange={(e) => setState({ ...state, password: e })}
          value={password}
        />
        <CustomHelpPpoints/>
        <TextField
          type="password"
          name="Confirm Password"
          show={state.eyeoff}
          error={errorValidation.confirmPassword.showError}
          showHelp={errorValidation.confirmPassword.message}
          required={true}
          placeHolder={"Enter New password"}
          onblur={() => validate("confirmPassword")}
          onChange={(e) => setState({ ...state, confirmPassword: e })}
          value={confirmPassword}
        />
        <div></div>
        <hr />
        <Button
          thickness="large"
          length="fullBtn"
          loading={loading}
          disable={
            errorValidation.password.error || errorValidation.confirmPassword.error
          }
          onClick={submitHandler}
        >
          Save
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

export default DI(ResetPassword, { func: { loginStatus } });
