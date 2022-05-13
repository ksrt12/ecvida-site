import React, { useContext, useEffect, useState } from 'react';
import AuthContext from "../context/AuthContext";
// import HostContext from "../context/HostContext";
import { flatObj } from "../hooks/useAuth";
import { useHttps } from "../hooks/useHttps";
import { ansAPI } from "../hooks/useHttps";
import { useMessage } from "../hooks/useMessage";

interface ansAuth extends ansAPI {
    data?: {
        nextScreen: boolean;
    } | string;
}

interface ansConfig extends ansAPI {
    data?: {
        human: {
            id: string;
            name: string;
            surname: string;
            patronymic: string;
            phone: string;
            email: string;
        };
        roomsList: {
            id: number;
            street: string;
            houseNumber: string;
            flatNumber: string;
            balance: string;
            balanceDecimal: number;
            balanceModel: {
                value: string;
                date: any;
                balanceNeedsToBeUpdated: boolean;
            };
            fullAdress: string;
            countRooms: string;
            subTitle: string;
            title: string;
            roomTypeTitle: string;
            roomTypeId: any;
            managementCompanyNumber: string;
            squareAll: string;
            accountNumber: string;
            oldAccountNumber: string;
            personNumber: number;
            accrual: {
                totalSumm: string;
                month: string;
                countAccrualsByThisMonth: number;
            };
        }[];
    };
}


export const AuthPage: React.FC = () => {
    const auth = useContext(AuthContext);
    // const HOST = useContext(HostContext).HOST
    const message = useMessage();
    const { loading, request, error, clearError } = useHttps();
    const [form, setForm] = useState({ login: "", password: "" });
    const [canAuth, setCanAuth] = useState(false);
    const [errAuth, setErrAuth] = useState("");

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const initLogin = async (token: string): Promise<[string, string, number, flatObj[]]> => {
        const settings: ansConfig = await request('/api/Config/GetSettings', 'GET', null, {
            "Authorization": "Bearer " + token,
            "Version": 4,
            "Content-Type": "application/json; charset=utf-8"
        });

        if (settings.isSuccess && settings.data) {

            let flats: flatObj[] = [];
            settings.data.roomsList.forEach(flat => flats.push({
                id: flat.id,
                adress: flat.fullAdress,
                balance: flat.balanceDecimal
            }));

            return [token, settings.data.human.id, flats[0].id, flats];

        }

        return ["", "", 0, [] as flatObj[]];

    };

    const authHandler = async (isPasswd: boolean) => {
        let extUrl = "";
        let extPasswd = "";
        if (isPasswd) {
            extUrl = "/enterpassword";
            extPasswd = "&Password=" + encodeURIComponent(form.password);
        }
        try {
            const data: ansAuth = await request("/login" + extUrl, "POST",
                "EmailOrPhone=" + form.login + extPasswd + "&IsMobile=true&accountType=Resident&isDevelop=false",
                {
                    "Version": 4,
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                });

            if (data.isSuccess && data.data) {
                setErrAuth("");
                if (isPasswd) {
                    const toStorage = await initLogin(data.data as string);
                    auth.login(...toStorage);
                } else {
                    // @ts-ignore
                    if (data.data.nextScreen) {
                        setCanAuth(true);
                        setErrAuth("");
                    }
                }
            } else {
                setErrAuth(data.error!.message);
            }
        } catch (e) { }
    };

    const prevStep = () => setCanAuth(false);
    return (
        <div className="authBg" style={{ backgroundImage: "url(/img29.jpg)" }}>
            <div className="authBgDark">
                <div className="container">
                    <div className="row">
                        <div className="authCard">
                            <div><img src="/icon.png" alt="Background" /></div>
                            <div className="card" style={{ width: "23rem" }}>
                                <div className="card-content">
                                    <span className="card-title">Авторизация</span>
                                    <div className="input-field">
                                        <input
                                            placeholder="E-mail, телефон или № ЛС"
                                            id="login"
                                            type="text"
                                            name="login"
                                            className="yellow-input"
                                            value={form.login}
                                            onChange={changeHandler}
                                            disabled={canAuth}
                                        />
                                    </div>
                                    {canAuth && <div className="input-field">
                                        <input
                                            placeholder="Пароль"
                                            id="password"
                                            type="password"
                                            name="password"
                                            className="yellow-input"
                                            value={form.password}
                                            onChange={changeHandler}
                                        />
                                    </div>}
                                    {errAuth && <p>{errAuth}</p>}
                                </div>

                                <div className="card-action">
                                    {!canAuth && <button
                                        className="btn blue darken-4"
                                        style={{ marginRight: 10 }}
                                        disabled={loading}
                                        onClick={() => authHandler(false)}
                                    >
                                        Далее
                                    </button>}
                                    {canAuth && <>
                                        <button
                                            className="btn blue darken-4"
                                            style={{ marginRight: 10 }}
                                            disabled={loading}
                                            onClick={() => authHandler(true)}
                                        >
                                            Войти
                                        </button>
                                        <button
                                            className="btn blue darken-2"
                                            style={{ marginRight: 10 }}
                                            onClick={prevStep}
                                        >
                                            Назад
                                        </button>
                                    </>}
                                    {loading && (
                                        <div className="preloader-wrapper small active">
                                            <div className="spinner-layer spinner-green-only">
                                                <div className="circle-clipper left">
                                                    <div className="circle"></div>
                                                </div><div className="gap-patch">
                                                    <div className="circle"></div>
                                                </div><div className="circle-clipper right">
                                                    <div className="circle"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};