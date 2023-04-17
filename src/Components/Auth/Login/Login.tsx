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
import { Eye, EyeOff } from "react-feather";
import {
  Button,
  FlexLayout,
  FormElement,
  TextField,
  Toast,
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
function Login(_props: PropsI): JSX.Element {
  const {
    history,
    di: { POST, globalState },
    success,
    error,
  } = _props;
  const [state, setState] = useState<loginStateObj>({
    username: "sarthakshukla@cedcommerce.com",
    password: "Sarthak@123",
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
    if (inputName === "password") {
      if (state.password)
        setErrorValidation({
          ...errorValidation,
          password: { error: false, message: " ", showError: false },
        });
      else
        setErrorValidation({
          ...errorValidation,
          password: {
            error: true,
            message: "Password can't be empty.",
            showError: true,
          },
        });
    }
  };

  const afterToken = (res: any) => {
    const token = parseJwt(res.data.token);
    dispatcher({ type: "user_id", state: { uId: token.user_id } });
    globalState.set(`${token.user_id}_auth_token`, JSON.stringify(token));
    success(res.message);
    setState({ ...state, loading: false });
    history(`/panel/${token.user_id}/dashboard`);
  };
  const submitHandler = () => {
    setState({ ...state, loading: true });
    let response = POST("user/login", {
      email: state.username,
      password: state.password,
    }).then((res) => {
      console.log(res);
      if (res.success) {
        afterToken(res);
      } else {
        error(res.message);
      }
    });
  };
  if (pageLoad) {
    return <></>;
  }

  const { username, password, loading, eyeoff } = state;
  return (
    <>
      <FormElement>
        <TextField
          name={"Email"}
          error={errorValidation.email.showError}
          showHelp={errorValidation.email.message}
          required={true}
          placeHolder={"ex: abc@gmail.com"}
          onblur={() => validate("username")}
          onChange={(e) => setState({ ...state, username: e })}
          value={username}
        />
        <div>
          <FlexLayout direction="vertical" spacing="mediumTight">
            <TextField
              name={"Password"}
              error={errorValidation.password.showError}
              showHelp={errorValidation.password.message}
              required={true}
              placeHolder={"Enter Password"}
              value={password}
              strength={false}
              show={eyeoff}
              type="password"
              innerSufIcon={
                eyeoff ? (
                  <Eye
                    color="#3B424F"
                    size={20}
                    onClick={() =>
                      setState({
                        ...state,
                        eyeoff: !eyeoff,
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
                        eyeoff: !eyeoff,
                      })
                    }
                  />
                )
              }
              onblur={() => validate("password")}
              onChange={(e) => setState({ ...state, password: e })}
            />

            <FlexLayout halign="end">
              <Button
                type="TextButton"
                thickness="thin"
                onClick={() => _props.history("/auth/forgot_password")}
              >
                Forgot Password?
              </Button>
            </FlexLayout>
          </FlexLayout>
        </div>
        <hr />
        <Button
          thickness="large"
          length="fullBtn"
          loading={loading}
          disable={
            errorValidation.email.error || errorValidation.password.error
          }
          onClick={submitHandler}
        >
          Login
        </Button>
      </FormElement>
    </>
  );
}

export default DI(Login, { func: { loginStatus } });
