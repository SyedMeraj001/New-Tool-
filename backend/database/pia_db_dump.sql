--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-12-24 15:31:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 41227)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    sector character varying(100),
    region character varying(100),
    reporting_framework character varying(50) DEFAULT 'GRI'::character varying,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 41226)
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 219
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- TOC entry 222 (class 1259 OID 41243)
-- Name: esg_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.esg_data (
    id integer NOT NULL,
    company_id integer NOT NULL,
    user_id integer NOT NULL,
    reporting_year integer NOT NULL,
    category character varying(50) NOT NULL,
    metric_name character varying(255) NOT NULL,
    metric_value numeric(15,4),
    unit character varying(50),
    framework_code character varying(50),
    status character varying(50) DEFAULT 'draft'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.esg_data OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41242)
-- Name: esg_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.esg_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.esg_data_id_seq OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 221
-- Name: esg_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.esg_data_id_seq OWNED BY public.esg_data.id;


--
-- TOC entry 224 (class 1259 OID 41262)
-- Name: esg_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.esg_scores (
    id integer NOT NULL,
    company_id integer NOT NULL,
    user_id integer NOT NULL,
    reporting_year integer NOT NULL,
    environmental_score numeric(5,2) DEFAULT 0,
    social_score numeric(5,2) DEFAULT 0,
    governance_score numeric(5,2) DEFAULT 0,
    overall_score numeric(5,2) DEFAULT 0,
    calculated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.esg_scores OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41261)
-- Name: esg_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.esg_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.esg_scores_id_seq OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 223
-- Name: esg_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.esg_scores_id_seq OWNED BY public.esg_scores.id;


--
-- TOC entry 225 (class 1259 OID 41289)
-- Name: esg_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.esg_summary AS
SELECT
    NULL::character varying(255) AS company_name,
    NULL::character varying(100) AS sector,
    NULL::character varying(100) AS region,
    NULL::character varying(50) AS reporting_framework,
    NULL::integer AS reporting_year,
    NULL::character varying(50) AS category,
    NULL::bigint AS metric_count,
    NULL::numeric AS env_score,
    NULL::numeric AS social_score,
    NULL::numeric AS gov_score,
    NULL::numeric AS overall_score;


ALTER VIEW public.esg_summary OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 41213)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 41212)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4765 (class 2604 OID 41230)
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 41246)
-- Name: esg_data id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_data ALTER COLUMN id SET DEFAULT nextval('public.esg_data_id_seq'::regclass);


--
-- TOC entry 4771 (class 2604 OID 41265)
-- Name: esg_scores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_scores ALTER COLUMN id SET DEFAULT nextval('public.esg_scores_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 41216)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4947 (class 0 OID 41227)
-- Dependencies: 220
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, sector, region, reporting_framework, created_by, created_at) FROM stdin;
1	E-S-GENIUS Tech Solutions	Technology	Asia-Pacific	GRI	1	2025-12-24 15:28:22.459214
2	Green Energy Corp	Energy	North America	SASB	1	2025-12-24 15:28:22.459214
3	Sustainable Manufacturing Ltd	Manufacturing	Europe	TCFD	2	2025-12-24 15:28:22.459214
4	EcoFinance Bank	Financial Services	Global	BRSR	2	2025-12-24 15:28:22.459214
\.


--
-- TOC entry 4949 (class 0 OID 41243)
-- Dependencies: 222
-- Data for Name: esg_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.esg_data (id, company_id, user_id, reporting_year, category, metric_name, metric_value, unit, framework_code, status, created_at) FROM stdin;
1	1	1	2024	environmental	Total GHG Emissions (Scope 1)	125.5000	tCO2e	GRI-305-1	approved	2025-12-24 15:28:22.468544
2	1	1	2024	environmental	Total GHG Emissions (Scope 2)	245.7500	tCO2e	GRI-305-2	approved	2025-12-24 15:28:22.468544
3	1	1	2024	environmental	Energy Consumption	2500.0000	MWh	GRI-302-1	approved	2025-12-24 15:28:22.468544
4	1	1	2024	environmental	Renewable Energy Percentage	65.0000	%	GRI-302-1	approved	2025-12-24 15:28:22.468544
5	1	1	2024	environmental	Water Consumption	15000.0000	m3	GRI-303-5	approved	2025-12-24 15:28:22.468544
6	1	1	2024	environmental	Waste Generated	45.2000	tonnes	GRI-306-3	approved	2025-12-24 15:28:22.468544
7	1	1	2024	environmental	Waste Recycled	38.4200	tonnes	GRI-306-4	approved	2025-12-24 15:28:22.468544
8	1	1	2024	social	Total Employees	150.0000	count	GRI-2-7	approved	2025-12-24 15:28:22.468544
9	1	1	2024	social	Female Employees	63.0000	count	GRI-405-1	approved	2025-12-24 15:28:22.468544
10	1	1	2024	social	Employee Turnover Rate	8.5000	%	GRI-401-1	approved	2025-12-24 15:28:22.468544
11	1	1	2024	social	Training Hours per Employee	45.0000	hours	GRI-404-1	approved	2025-12-24 15:28:22.468544
12	1	1	2024	social	Safety Incidents	2.0000	count	GRI-403-9	approved	2025-12-24 15:28:22.468544
13	1	1	2024	social	Community Investment	50000.0000	USD	GRI-413-1	approved	2025-12-24 15:28:22.468544
14	1	1	2024	governance	Board Size	7.0000	count	GRI-2-9	approved	2025-12-24 15:28:22.468544
15	1	1	2024	governance	Independent Directors	4.0000	count	GRI-2-9	approved	2025-12-24 15:28:22.468544
16	1	1	2024	governance	Female Board Members	3.0000	count	GRI-405-1	approved	2025-12-24 15:28:22.468544
17	1	1	2024	governance	Ethics Training Completion	100.0000	%	GRI-2-15	approved	2025-12-24 15:28:22.468544
18	1	1	2024	governance	Data Privacy Incidents	0.0000	count	GRI-418-1	approved	2025-12-24 15:28:22.468544
19	2	2	2024	environmental	Total GHG Emissions (Scope 1)	1250.0000	tCO2e	SASB-IF-EU-110a.1	approved	2025-12-24 15:28:22.468544
20	2	2	2024	environmental	Renewable Energy Generation	85000.0000	MWh	SASB-IF-EU-000.A	approved	2025-12-24 15:28:22.468544
21	2	2	2024	social	Total Employees	500.0000	count	SASB-IF-EU-000.B	approved	2025-12-24 15:28:22.468544
22	2	2	2024	governance	Board Independence	80.0000	%	SASB-IF-EU-550a.1	approved	2025-12-24 15:28:22.468544
23	3	3	2024	environmental	Climate Risk Assessment	1.0000	completed	TCFD-Strategy	approved	2025-12-24 15:28:22.468544
24	3	3	2024	environmental	Carbon Intensity	0.4500	tCO2e/revenue	TCFD-Metrics	approved	2025-12-24 15:28:22.468544
25	3	3	2024	social	Total Employees	1200.0000	count	TCFD-General	approved	2025-12-24 15:28:22.468544
26	3	3	2024	governance	Climate Governance	1.0000	established	TCFD-Governance	approved	2025-12-24 15:28:22.468544
\.


--
-- TOC entry 4951 (class 0 OID 41262)
-- Dependencies: 224
-- Data for Name: esg_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.esg_scores (id, company_id, user_id, reporting_year, environmental_score, social_score, governance_score, overall_score, calculated_at) FROM stdin;
1	1	1	2024	85.50	78.25	92.00	85.25	2025-12-24 15:28:22.47449
2	2	2	2024	92.00	75.50	88.75	85.42	2025-12-24 15:28:22.47449
3	3	3	2024	78.25	82.00	85.50	81.92	2025-12-24 15:28:22.47449
4	4	2	2024	88.75	85.25	90.00	88.00	2025-12-24 15:28:22.47449
\.


--
-- TOC entry 4945 (class 0 OID 41213)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, full_name, role, status, created_at, approved_at) FROM stdin;
1	admin@esgenius.com	$2b$10$admin123hash	ESG Admin	admin	approved	2025-12-24 15:28:22.45333	2025-12-24 15:28:22.45333
2	superadmin1@esgenius.com	$2b$10$superadmin123hash	Super Admin	superadmin	approved	2025-12-24 15:28:22.45333	2025-12-24 15:28:22.45333
3	manager@esgenius.com	$2b$10$manager123hash	ESG Manager	manager	approved	2025-12-24 15:28:22.45333	2025-12-24 15:28:22.45333
4	analyst@esgenius.com	$2b$10$analyst123hash	ESG Analyst	user	approved	2025-12-24 15:28:22.45333	2025-12-24 15:28:22.45333
\.


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 219
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 4, true);


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 221
-- Name: esg_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.esg_data_id_seq', 26, true);


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 223
-- Name: esg_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.esg_scores_id_seq', 4, true);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4784 (class 2606 OID 41236)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 41250)
-- Name: esg_data esg_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_data
    ADD CONSTRAINT esg_data_pkey PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 41272)
-- Name: esg_scores esg_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_scores
    ADD CONSTRAINT esg_scores_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 41225)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4782 (class 2606 OID 41223)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4785 (class 1259 OID 41288)
-- Name: idx_companies_sector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_companies_sector ON public.companies USING btree (sector);


--
-- TOC entry 4788 (class 1259 OID 41284)
-- Name: idx_esg_data_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_esg_data_category ON public.esg_data USING btree (category);


--
-- TOC entry 4789 (class 1259 OID 41283)
-- Name: idx_esg_data_company_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_esg_data_company_year ON public.esg_data USING btree (company_id, reporting_year);


--
-- TOC entry 4790 (class 1259 OID 41285)
-- Name: idx_esg_data_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_esg_data_status ON public.esg_data USING btree (status);


--
-- TOC entry 4777 (class 1259 OID 41286)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4778 (class 1259 OID 41287)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 4943 (class 2618 OID 41292)
-- Name: esg_summary _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.esg_summary AS
 SELECT c.name AS company_name,
    c.sector,
    c.region,
    c.reporting_framework,
    ed.reporting_year,
    ed.category,
    count(ed.id) AS metric_count,
    avg(
        CASE
            WHEN ((ed.category)::text = 'environmental'::text) THEN es.environmental_score
            ELSE NULL::numeric
        END) AS env_score,
    avg(
        CASE
            WHEN ((ed.category)::text = 'social'::text) THEN es.social_score
            ELSE NULL::numeric
        END) AS social_score,
    avg(
        CASE
            WHEN ((ed.category)::text = 'governance'::text) THEN es.governance_score
            ELSE NULL::numeric
        END) AS gov_score,
    avg(es.overall_score) AS overall_score
   FROM ((public.companies c
     LEFT JOIN public.esg_data ed ON ((c.id = ed.company_id)))
     LEFT JOIN public.esg_scores es ON (((c.id = es.company_id) AND (ed.reporting_year = es.reporting_year))))
  GROUP BY c.id, ed.reporting_year, ed.category;


--
-- TOC entry 4793 (class 2606 OID 41237)
-- Name: companies fk_companies_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT fk_companies_created_by FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4794 (class 2606 OID 41251)
-- Name: esg_data fk_esg_data_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_data
    ADD CONSTRAINT fk_esg_data_company FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 4795 (class 2606 OID 41256)
-- Name: esg_data fk_esg_data_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_data
    ADD CONSTRAINT fk_esg_data_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4796 (class 2606 OID 41273)
-- Name: esg_scores fk_esg_scores_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_scores
    ADD CONSTRAINT fk_esg_scores_company FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- TOC entry 4797 (class 2606 OID 41278)
-- Name: esg_scores fk_esg_scores_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esg_scores
    ADD CONSTRAINT fk_esg_scores_user FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-12-24 15:31:07

--
-- PostgreSQL database dump complete
--

