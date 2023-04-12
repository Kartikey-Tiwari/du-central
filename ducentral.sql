PGDMP                         {         	   ducentral    15.2     15.2 (Ubuntu 15.2-1.pgdg22.04+1) 0    }           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ~           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16389 	   ducentral    DATABASE     t   CREATE DATABASE ducentral WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE ducentral;
                college    false            �           0    0 	   ducentral    DATABASE PROPERTIES     2   ALTER DATABASE ducentral SET "TimeZone" TO 'utc';
                     college    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                college    false            S           1247    16445    degsem    TYPE     K   CREATE TYPE public.degsem AS ENUM (
    '4',
    '6',
    '8',
    '10'
);
    DROP TYPE public.degsem;
       public          college    false    5            M           1247    16418    sem    TYPE     ~   CREATE TYPE public.sem AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10'
);
    DROP TYPE public.sem;
       public          college    false    5            �            1259    16490    course    TABLE     �   CREATE TABLE public.course (
    id integer NOT NULL,
    spec_id integer NOT NULL,
    name character varying(50) NOT NULL,
    semester public.sem NOT NULL
);
    DROP TABLE public.course;
       public         heap    college    false    845    5            �            1259    16489    course_id_seq    SEQUENCE     �   CREATE SEQUENCE public.course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.course_id_seq;
       public          college    false    5    221            �           0    0    course_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;
          public          college    false    220            �            1259    16453    degree    TABLE     n   CREATE TABLE public.degree (
    name character varying(20) NOT NULL,
    semesters public.degsem NOT NULL
);
    DROP TABLE public.degree;
       public         heap    college    false    851    5            �            1259    16501    material    TABLE     �  CREATE TABLE public.material (
    id character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    course integer NOT NULL,
    contributor character varying(30) NOT NULL,
    upload_date timestamp without time zone NOT NULL,
    views integer DEFAULT 0,
    votes integer DEFAULT 0,
    type character varying(10) NOT NULL,
    contributor_email character varying(50) NOT NULL
);
    DROP TABLE public.material;
       public         heap    college    false    5            �            1259    16478    specialization    TABLE     �   CREATE TABLE public.specialization (
    id integer NOT NULL,
    degree_id integer NOT NULL,
    specialization character varying(35) NOT NULL
);
 "   DROP TABLE public.specialization;
       public         heap    college    false    5            �            1259    16477    specialization_id_seq    SEQUENCE     �   CREATE SEQUENCE public.specialization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.specialization_id_seq;
       public          college    false    219    5            �           0    0    specialization_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.specialization_id_seq OWNED BY public.specialization.id;
          public          college    false    218            �            1259    16459 	   unidegree    TABLE     �   CREATE TABLE public.unidegree (
    id integer NOT NULL,
    uni character varying(50) NOT NULL,
    degree character varying(20) NOT NULL
);
    DROP TABLE public.unidegree;
       public         heap    college    false    5            �            1259    16458    unidegree_id_seq    SEQUENCE     �   CREATE SEQUENCE public.unidegree_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.unidegree_id_seq;
       public          college    false    217    5            �           0    0    unidegree_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.unidegree_id_seq OWNED BY public.unidegree.id;
          public          college    false    216            �            1259    16439 
   university    TABLE     L   CREATE TABLE public.university (
    name character varying(50) NOT NULL
);
    DROP TABLE public.university;
       public         heap    college    false    5            �           2604    16493 	   course id    DEFAULT     f   ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);
 8   ALTER TABLE public.course ALTER COLUMN id DROP DEFAULT;
       public          college    false    221    220    221            �           2604    16481    specialization id    DEFAULT     v   ALTER TABLE ONLY public.specialization ALTER COLUMN id SET DEFAULT nextval('public.specialization_id_seq'::regclass);
 @   ALTER TABLE public.specialization ALTER COLUMN id DROP DEFAULT;
       public          college    false    219    218    219            �           2604    16462    unidegree id    DEFAULT     l   ALTER TABLE ONLY public.unidegree ALTER COLUMN id SET DEFAULT nextval('public.unidegree_id_seq'::regclass);
 ;   ALTER TABLE public.unidegree ALTER COLUMN id DROP DEFAULT;
       public          college    false    217    216    217            y          0    16490    course 
   TABLE DATA           =   COPY public.course (id, spec_id, name, semester) FROM stdin;
    public          college    false    221   �3       s          0    16453    degree 
   TABLE DATA           1   COPY public.degree (name, semesters) FROM stdin;
    public          college    false    215   04       z          0    16501    material 
   TABLE DATA           u   COPY public.material (id, name, course, contributor, upload_date, views, votes, type, contributor_email) FROM stdin;
    public          college    false    222   ^4       w          0    16478    specialization 
   TABLE DATA           G   COPY public.specialization (id, degree_id, specialization) FROM stdin;
    public          college    false    219   {4       u          0    16459 	   unidegree 
   TABLE DATA           4   COPY public.unidegree (id, uni, degree) FROM stdin;
    public          college    false    217   �4       r          0    16439 
   university 
   TABLE DATA           *   COPY public.university (name) FROM stdin;
    public          college    false    214   05       �           0    0    course_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.course_id_seq', 3, true);
          public          college    false    220            �           0    0    specialization_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.specialization_id_seq', 7, true);
          public          college    false    218            �           0    0    unidegree_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.unidegree_id_seq', 2, true);
          public          college    false    216            �           2606    16495    course course_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.course DROP CONSTRAINT course_pkey;
       public            college    false    221            �           2606    16457    degree degree_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.degree
    ADD CONSTRAINT degree_pkey PRIMARY KEY (name);
 <   ALTER TABLE ONLY public.degree DROP CONSTRAINT degree_pkey;
       public            college    false    215            �           2606    16507    material material_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.material DROP CONSTRAINT material_pkey;
       public            college    false    222            �           2606    16483 "   specialization specialization_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.specialization
    ADD CONSTRAINT specialization_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.specialization DROP CONSTRAINT specialization_pkey;
       public            college    false    219            �           2606    16466    unidegree ud_key 
   CONSTRAINT     R   ALTER TABLE ONLY public.unidegree
    ADD CONSTRAINT ud_key UNIQUE (uni, degree);
 :   ALTER TABLE ONLY public.unidegree DROP CONSTRAINT ud_key;
       public            college    false    217    217            �           2606    16464    unidegree unidegree_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.unidegree
    ADD CONSTRAINT unidegree_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.unidegree DROP CONSTRAINT unidegree_pkey;
       public            college    false    217            �           2606    16443    university university_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.university
    ADD CONSTRAINT university_pkey PRIMARY KEY (name);
 D   ALTER TABLE ONLY public.university DROP CONSTRAINT university_pkey;
       public            college    false    214            �           2606    16496    course course_ibfk_1    FK CONSTRAINT     |   ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_ibfk_1 FOREIGN KEY (spec_id) REFERENCES public.specialization(id);
 >   ALTER TABLE ONLY public.course DROP CONSTRAINT course_ibfk_1;
       public          college    false    3034    221    219            �           2606    16508    material fk_material_course    FK CONSTRAINT     z   ALTER TABLE ONLY public.material
    ADD CONSTRAINT fk_material_course FOREIGN KEY (course) REFERENCES public.course(id);
 E   ALTER TABLE ONLY public.material DROP CONSTRAINT fk_material_course;
       public          college    false    3036    222    221            �           2606    16484    specialization fk_spec_degree    FK CONSTRAINT     �   ALTER TABLE ONLY public.specialization
    ADD CONSTRAINT fk_spec_degree FOREIGN KEY (degree_id) REFERENCES public.unidegree(id);
 G   ALTER TABLE ONLY public.specialization DROP CONSTRAINT fk_spec_degree;
       public          college    false    219    217    3032            �           2606    16472    unidegree fk_unideg_degree    FK CONSTRAINT     {   ALTER TABLE ONLY public.unidegree
    ADD CONSTRAINT fk_unideg_degree FOREIGN KEY (degree) REFERENCES public.degree(name);
 D   ALTER TABLE ONLY public.unidegree DROP CONSTRAINT fk_unideg_degree;
       public          college    false    217    3028    215            �           2606    16467    unidegree fk_unideg_uni    FK CONSTRAINT     y   ALTER TABLE ONLY public.unidegree
    ADD CONSTRAINT fk_unideg_uni FOREIGN KEY (uni) REFERENCES public.university(name);
 A   ALTER TABLE ONLY public.unidegree DROP CONSTRAINT fk_unideg_uni;
       public          college    false    217    214    3026                       826    16391     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     O   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES  TO college;
                   postgres    false                       826    16393    DEFAULT PRIVILEGES FOR TYPES    DEFAULT ACL     K   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES  TO college;
                   postgres    false                       826    16392     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     O   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS  TO college;
                   postgres    false                       826    16390    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     L   ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES  TO college;
                   postgres    false            y   d   x��;
�0 й=EN �������K�44�& ����^�0���QY���r�b��@&���A�x�&9Ap.��i�k���+���L'��|��?�*�� 
�!=      s      x�s
N�4�r
NV����/*rb���� N��      z      x������ � �      w   c   x�3�4�t�2R��%�\�@V@Feqfr1�	�횓�\R���rr�d��*'g��%�s�E �s`�
�%
@C�qKf��f�Ur��qqq ��'f      u   2   x�3���,K-*�,�T�OSpI����t
N�2�%�����_T����� �9G      r   !   x���,K-*�,�T�OSpI�������� y�     