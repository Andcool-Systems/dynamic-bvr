'use server';

import { headers } from "next/headers";
import { prisma } from '@/lib/prisma';
import Client from "./client";
import Register from "./register";
import { Metadata } from "next";
import punycode from 'punycode';
import Main from "./main";

export const generateMetadata = async (): Promise<Metadata> => {
    const headersList = await headers();
    const host = headersList.get('host') as string;

    const fragments = host.split('.');
    const data = await getSubdomain(fragments[0]);
    const unicodeHost = punycode.toUnicode(host);

    if (!data) {
        return {
            title: unicodeHost,
            description: `Домен ${unicodeHost} доступен для регистрации! Возьмите в рот прямо сейчас!`,
            openGraph: {
                title: unicodeHost,
                description: `Домен ${unicodeHost} доступен для регистрации! Возьмите в рот прямо сейчас!`,
                url: `https://${unicodeHost}`,
                siteName: unicodeHost
            }
        }
    }

    return {
        title: `${data.name} берет в рот`,
        description: `${data.description},\nВозьму в рот.`,
        openGraph: {
            title: `${data.name} берет в рот`,
            description: `${data.description},\nВозьму в рот.`,
            url: `https://${unicodeHost}`,
            siteName: unicodeHost
        },
        other: {
            'theme-color': data.background_color
        }
    }
}

const getSubdomain = async (subdomain: string) =>
    await prisma.subdomain.findFirst({
        where: { subdomain },
        select: { subdomain: true, name: true, description: true, background_color: true, url: true, distance: true }
    });


const Home = async () => {
    const headersList = await headers();
    const host = headersList.get('host') as string;

    const fragments = host.split('.');
    const data = await getSubdomain(fragments[0]);

    if (fragments[0] === 'xn--80aafc4bo1k') {
        return <Main />
    }

    if (!data) {
        return <Register subdomain={fragments[0]} />
    }

    return <Client data={data} />;
}

export default Home;
