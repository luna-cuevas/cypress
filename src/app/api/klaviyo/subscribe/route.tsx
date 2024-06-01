import { NextResponse } from "next/server";

async function createProfile(email: string, klaviyoApiKey: string) {
  const profilePayload = {
    data: {
      type: "profile",
      attributes: {
        email: email,
        // Add other attributes if necessary
      },
    },
  };

  const profileOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      revision: "2024-05-15",
      "content-type": "application/json",
      Authorization: `Klaviyo-API-Key ${klaviyoApiKey}`,
    },
    body: JSON.stringify(profilePayload),
  };

  const response = await fetch(
    "https://a.klaviyo.com/api/profiles/",
    profileOptions
  );

  const result = await response.json();
  return result;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  const klaviyoApiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = "UH9Ye3"; // Replace with your actual Klaviyo list ID

  if (!email) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  try {
    const profile = await createProfile(email, klaviyoApiKey as string);

    if (profile.errors) {
      return NextResponse.json({
        error: "Error creating profile",
        result: profile.errors,
      });
    }

    console.log("Profile created:", profile);

    const profileId = profile.data.id;

    const subscriptionPayload = {
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          custom_source: "Subscription",
          profiles: {
            data: [
              {
                type: "profile",
                id: profileId,
                attributes: {
                  email: email,
                  subscriptions: {
                    email: { marketing: { consent: "SUBSCRIBED" } },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: { type: "list", id: listId },
          },
        },
      },
    };

    const subscriptionOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        revision: "2024-05-15",
        "content-type": "application/json",
        Authorization: `Klaviyo-API-Key ${klaviyoApiKey}`,
      },
      body: JSON.stringify(subscriptionPayload),
    };

    const subscriptionResponse = await fetch(
      "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
      subscriptionOptions
    );

    console.log("Subscription response:", subscriptionResponse);

    if (subscriptionResponse.status !== 202) {
      return NextResponse.json({
        error: "Error subscribing",
        result: subscriptionResponse,
      });
    }

    return NextResponse.json({
      result: subscriptionResponse,
      message: "Subscription successful!",
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json({ error: "Error subscribing", result: error });
  }
}
