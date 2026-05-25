CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"epk_slug" text NOT NULL,
	"type" text NOT NULL,
	"filename" text NOT NULL,
	"path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "epks" (
	"slug" text PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_epk_slug_epks_slug_fk" FOREIGN KEY ("epk_slug") REFERENCES "public"."epks"("slug") ON DELETE cascade ON UPDATE no action;
