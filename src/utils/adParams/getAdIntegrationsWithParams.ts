/**
 * Object defining the parameters used in ad integrations, including their requirements and validation rules.
 *
 * @type {Object}
 * @property {Object} imageURL - The URL of the image to be used in the ad.
 *   @property {boolean} required - Indicates whether this parameter is mandatory.
 *   @property {RegExp} validation - Regular expression for validating the image URL format.
 *   @property {Array<string>} variants - Possible variants of the image size or format.
 *
 * @property {Object} linkURL - The URL where the ad will link to.
 *   @property {boolean} required - Indicates whether this parameter is mandatory.
 *   @property {RegExp} validation - Regular expression for validating the link URL format.
 *
 * @property {Object} xCreatorHandle - The handle of the content creator.
 *   @property {boolean} required - Indicates whether this parameter is mandatory.
 *   @property {RegExp} validation - Regular expression for validating the content creator handle format.
 *
 * @property {Object} xSpaceId - The identifier for the ad space.
 *   @property {boolean} required - Indicates whether this parameter is mandatory.
 *   @property {RegExp} validation - Regular expression for validating the ad space ID format.
 */
const adParameters = {
  imageURL: {
    required: true,
    validation: /^\w+:\/\/[\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))$/,
    variants: ["320x50", "1:1", "ipfs", "jpg"]
  },
  linkURL: {
    required: true,
    validation: /^https:\/\/[^[\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))$/
  },
  xCreatorHandle: {
    required: false,
    validation: /^@\w{1,15}$/
  },
  xSpaceId: {
    required: false,
    validation: /^\d[A-Za-z\d]{12}$/
  }
};

/**
 * Object defining various ad integrations, including their required parameters and supported platforms.
 *
 * @type {Object}
 * @property {Object} DynamicBanner - Integration for dynamic banner ads.
 *   @property {Array<string>} requiredParams - List of parameters required for this integration.
 *   @property {Array<string>} platforms - Platforms where this integration can be used.
 *
 * @property {Object} ClickableLogosGrid - Integration for clickable logos grid ads.
 *   @property {Array<string>} requiredParams - List of parameters required for this integration.
 *   @property {Array<string>} platforms - Platforms where this integration can be used.
 *
 * @property {Object} LogosGrid - Integration for logos grid ads.
 *   @property {Array<string>} requiredParams - List of parameters required for this integration.
 *   @property {Array<string>} platforms - Platforms where this integration can be used.
 *
 * @property {Object} xCreatorHighlight - Integration for highlighting content creators.
 *   @property {Array<string>} requiredParams - List of parameters required for this integration.
 *   @property {Array<string>} platforms - Platforms where this integration can be used.
 *
 * @property {Object} xSpaceHighlight - Integration for highlighting ad spaces.
 *   @property {Array<string>} requiredParams - List of parameters required for this integration.
 *   @property {Array<string>} platforms - Platforms where this integration can be used.
 */
const adIntegrations = {
  DynamicBanner: {
    requiredParams: ["imageURL", "linkURL"],
    platforms: ["Newsletter", "React Native", "Web"]
  },
  ClickableLogosGrid: {
    requiredParams: ["imageURL", "linkURL"],
    platforms: ["Newsletter", "React Native", "Web"]
  },
  LogosGrid: {
    requiredParams: ["imageURL"],
    platforms: ["Newsletter", "Print", "React Native", "Web"]
  },
  xCreatorHighlight: {
    requiredParams: ["xCreatorHandle"],
    platforms: ["Newsletter", "React Native", "Web"]
  },
  xSpaceHighlight: {
    requiredParams: ["xSpaceId"],
    platforms: ["React Native", "Web"]
  }
};

/**
 * Extracts valid parameters from a list of ad parameters.
 *
 * @param {Array<Object>} adParams - Array of ad parameters, each containing a `base` and `id`.
 * @returns {Object} - An object mapping the base parameter names to their corresponding IDs.
 */
function extractValidParams(adParams) {
  const params = {};
  adParams.forEach((param) => {
    params[param.base] = param.id;
  });
  return params;
}

/**
 * Determines the possible ad integrations based on the provided ad parameters.
 *
 * This function checks which ad integrations are possible given the supplied ad parameters and their formats.
 *
 * @param {Array<Object>} adParams - Array of ad parameters, each containing a `base` and `id`.
 * @returns {Array<Object>} - A list of possible ad integrations, each including:
 *   @property {string} name - The name of the ad integration.
 *   @property {Array<Object>} requiredParams - Details of the required parameters for the integration.
 *   @property {Array<string>} platforms - Platforms where this integration can be used.
 *
 * @example
 * const adParams = [
 *   { base: "imageURL", id: "http://example.com/image.jpg" },
 *   { base: "linkURL", id: "https://example.com" }
 * ];
 * const integrations = getPossibleAdIntegrations(adParams);
 * // `integrations` will include possible ad integrations based on provided ad parameters.
 */
export function getPossibleAdIntegrations(adParams) {
  const params = extractValidParams(adParams);
  const possibleIntegrations: {
    name: string;
    requiredParams: { id: any; base: string; variants: any; description: string }[];
    platforms: string[];
  }[] = [];

  for (const [key, integration] of Object.entries(adIntegrations)) {
    let isValid = true;
    let detailedParams: { id: any; base: string; variants: any; description: string }[] = [];

    for (const reqParam of integration.requiredParams) {
      const [baseParam, variant] = reqParam.split("-");
      if (!(params[baseParam] && (!variant || params[baseParam].endsWith(variant)))) {
        isValid = false;
        break;
      }
      // Collecte des détails du paramètre requis pour l'intégration
      detailedParams.push({
        id: params[baseParam],
        base: baseParam,
        variants: adParameters[baseParam]?.variants || [],
        description: adParameters[baseParam]?.description || "No description available"
      });
    }

    if (isValid) {
      possibleIntegrations.push({
        name: key,
        requiredParams: detailedParams,
        platforms: integration.platforms
      });
    }
  }

  return possibleIntegrations;
}
