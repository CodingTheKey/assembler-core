-- CreateEnum
CREATE TYPE "public"."MeetingStatus" AS ENUM ('SCHEDULED', 'CANCELED', 'PAUSED', 'FINISHED');

-- CreateTable
CREATE TABLE "public"."unities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."associates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "associated_unity_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "url_image" TEXT,
    "gender" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "place_of_birth" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "cell_phone" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "is_special_needs" BOOLEAN NOT NULL DEFAULT false,
    "voter_registration_number" TEXT NOT NULL,
    "electoral_zone" TEXT NOT NULL,
    "electoral_section" TEXT NOT NULL,
    "marital_status" TEXT NOT NULL,
    "unity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "associates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meetings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unity_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "status" "public"."MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meeting_participants" (
    "id" TEXT NOT NULL,
    "meeting_id" TEXT NOT NULL,
    "associate_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meeting_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unities_name_key" ON "public"."unities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "associates_email_key" ON "public"."associates"("email");

-- CreateIndex
CREATE UNIQUE INDEX "associates_cpf_key" ON "public"."associates"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_participants_meeting_id_associate_id_key" ON "public"."meeting_participants"("meeting_id", "associate_id");

-- AddForeignKey
ALTER TABLE "public"."associates" ADD CONSTRAINT "associates_unity_id_fkey" FOREIGN KEY ("unity_id") REFERENCES "public"."unities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meetings" ADD CONSTRAINT "meetings_unity_id_fkey" FOREIGN KEY ("unity_id") REFERENCES "public"."unities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meeting_participants" ADD CONSTRAINT "meeting_participants_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meeting_participants" ADD CONSTRAINT "meeting_participants_associate_id_fkey" FOREIGN KEY ("associate_id") REFERENCES "public"."associates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
