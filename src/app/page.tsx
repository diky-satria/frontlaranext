"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import React, { use, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input } from "antd";

import styles from "./page.module.scss";
import axios from "@/interceptor/axios";
import { signIn, useSession } from "next-auth/react";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data }: any = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<any>([]);

  const callbackUrl: any = "/admin";

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      let response = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!response?.error) {
        router.push(callbackUrl);
      } else {
        const err = JSON.parse(response.error);
        setErrors(err);
      }
    } catch (error: any) {
      setErrors(error.message);
    }
  };

  const loginGoogle = async () => {
    await signIn("google", {
      redirect: false,
    });
  };

  return (
    <>
      <Head>
        <title>login</title>
      </Head>
      <div className={styles.container}>
        <form
          name="normal_login"
          className={`${styles.form} login-form`}
          onSubmit={handleSubmit}
        >
          <h3 className={styles.title}>Login</h3>
          {/* {error && <p className={styles.error}>{error}</p>} */}
          <Flex vertical gap={10}>
            <div>
              <Form.Item
                validateStatus={errors["email"] ? "error" : ""}
                help={errors["email"] ? errors["email"][0] : ""}
                style={{ marginBottom: errors["email"] ? 0 : 0 }}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                validateStatus={errors["password"] ? "error" : ""}
                help={errors["password"] ? errors["password"][0] : ""}
                style={{ marginBottom: errors["password"] ? 0 : 0 }}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Login
                </Button>
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                Don't Have an account!{" "}
                <Link href="/auth/register">please register</Link>
              </Form.Item>
            </div>
          </Flex>
        </form>
        {/* <h4 onClick={() => loginGoogle()}>Login with google</h4> */}
      </div>
    </>
  );
};

export default Home;
