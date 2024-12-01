'use client';

import { CSSProperties, useEffect, useRef, useState } from "react";
import { publishForm } from "./actions/publish.module";
import styles from '@/app/styles/main.module.css';
import styles_create from '@/app/styles/create.module.css';
import Image from "next/image";
import { inverseColor, isBright } from "./utils/utils";
import punycode from 'punycode';

interface ResponseInterface {
    error: boolean;
    message?: string;
    data?: {
        subdomain: string;
        name: string;
        url: string | null;
        description: string;
        background_color: string;
        distance: number;
        key: string;
    };
}

const Register = ({ subdomain }: { subdomain: string }) => {
    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
    const [response, setResponse] = useState<ResponseInterface | null>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);
    const bright = isBright(backgroundColor);

    const handleSubmit = async (data: FormData) => {
        const name = data.get('name');
        const distance = data.get('distance');
        const description = data.get('description');
        if (!name || distance === '' || !description) {
            return;
        }
        setResponse(await publishForm(data, subdomain));
    }

    useEffect(() => {
        if (!response) return;

        if (response.error || !response.data) {
            alert(response.message);
            return;
        }

        const ls = localStorage.getItem('keys');
        const json_ls = JSON.parse(ls ?? '{}') as { [key: string]: string };

        json_ls[response.data.subdomain] = response.data.key;
        localStorage.setItem('keys', JSON.stringify(json_ls));

        window.location.reload();
    }, [response]);

    const handleColorOpen = () => {
        if (colorInputRef.current) {
            colorInputRef.current.click();
        }
    };

    return (
        <>
            <form action={handleSubmit}>
                <main
                    className={`${styles.main} ${styles_create.main}`}
                    style={{
                        backgroundColor: backgroundColor,
                        '--color': bright ? '#3f3f3f' : '#aaa',
                        '--inverse-color': bright ? '#fff' : '#000',
                        '--inverse-background': inverseColor(backgroundColor)
                    } as CSSProperties}
                >
                    <h2 style={{ position: 'fixed', left: 0, top: 0, margin: '.5rem' }}>Регистрация домена {punycode.toUnicode(subdomain)}.беретврот.рф</h2>
                    <div>
                        <h1>
                            <input type="text" name="name" placeholder="Введите имя" />,
                            <input
                                type="number"
                                name="distance"
                                placeholder="Расстояние"
                                defaultValue={300}
                                className={styles_create.distance} />
                            метров от вас
                        </h1>
                        <h2>
                            <textarea
                                name="description"
                                maxLength={100} />, <br />
                            Возьму в рот
                        </h2>
                        <button type="submit">Опубликовать</button>
                        <div>
                            <div
                                onClick={handleColorOpen}
                                className={styles_create.color}
                            >
                                <Image
                                    src='/palette.svg'
                                    alt='palette'
                                    style={{ filter: `invert(${bright ? 1 : 0})` }}
                                    width={24}
                                    height={24} />
                            </div>
                            <input
                                type="color"
                                name="color"
                                defaultValue='#ffffff'
                                ref={colorInputRef}
                                style={{ display: 'none' }}
                                onChange={e => setBackgroundColor(e.target.value)}
                            />
                        </div>
                    </div>
                </main>
            </form>
        </>
    )
}

export default Register;