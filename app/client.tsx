"use client";

import { Subdomain } from "@prisma/client";
import styles from '@/app/styles/main.module.css';
import { formatText, isBright } from "./utils/utils";
import { CSSProperties } from "react";

const Client = ({ data }: { data: Subdomain }) => {
    const bright = isBright(data.background_color);

    return (
        <main
            style={
                {
                    backgroundColor: data.background_color,
                    '--color': bright ? '#3f3f3f' : '#aaa'
                } as CSSProperties
            }
            className={styles.main}
        >
            <div>
                <h1>
                    <a
                        href={data.url ?? undefined}
                        className={`${styles.link} ${bright && styles.link_bright}`}
                    >
                        {data.name}
                    </a>, {data.distance} метров от вас.
                </h1>
                <h2>{formatText(data.description + ',\nВозьму в рот.')}</h2>
            </div>
        </main>
    )
}

export default Client;