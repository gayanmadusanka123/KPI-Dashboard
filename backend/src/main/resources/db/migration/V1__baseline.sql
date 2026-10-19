--
-- PostgreSQL database dump
--


-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
--




--
-- Name: kpi_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kpi_profiles (
    id bigint NOT NULL,
    critical_threshold double precision NOT NULL,
    higher_better boolean NOT NULL,
    kpi_type character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    target double precision NOT NULL,
    unit character varying(255) NOT NULL,
    warning_threshold double precision NOT NULL,
    weight double precision NOT NULL,
    CONSTRAINT kpi_profiles_kpi_type_check CHECK (((kpi_type)::text = ANY ((ARRAY['MONTHLY_REVENUE'::character varying, 'CSAT_SCORE'::character varying, 'HEAD_COUNT'::character varying, 'DEFECT_RATE'::character varying, 'SALES_CONVERSION'::character varying, 'OPERATIONAL_COST'::character varying, 'WEBSITE_TRAFFIC'::character varying, 'ON_TIME_DELIVERY'::character varying])::text[])))
);


--
-- Name: kpi_profiles_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kpi_profiles_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kpi_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kpi_values (
    id bigint NOT NULL,
    actual_value double precision NOT NULL,
    value_date date NOT NULL,
    kpi_profile_id bigint NOT NULL
);


--
-- Name: kpi_values_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kpi_values_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    last_login timestamp(6) without time zone,
    password character varying(255) NOT NULL,
    role smallint NOT NULL,
    updated_at timestamp(6) without time zone,
    user_name character varying(255) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role >= 0) AND (role <= 1)))
);


--
--



--
-- Name: kpi_profiles kpi_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kpi_profiles
    ADD CONSTRAINT kpi_profiles_pkey PRIMARY KEY (id);


--
-- Name: kpi_values kpi_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kpi_values
    ADD CONSTRAINT kpi_values_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: kpi_profiles ukark7twvrvjkvt6kou7bt6pdjy; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kpi_profiles
    ADD CONSTRAINT ukark7twvrvjkvt6kou7bt6pdjy UNIQUE (kpi_type);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
--



--
-- Name: kpi_values fkk4m02k8lur29yw9p7m45tf3ej; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kpi_values
    ADD CONSTRAINT fkk4m02k8lur29yw9p7m45tf3ej FOREIGN KEY (kpi_profile_id) REFERENCES public.kpi_profiles(id);


--
-- PostgreSQL database dump complete
--


