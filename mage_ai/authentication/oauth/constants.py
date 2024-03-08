from enum import Enum
from typing import Optional

from mage_ai.settings import get_settings_value
from mage_ai.settings.keys import GHE_HOSTNAME

ACTIVE_DIRECTORY_CLIENT_ID = '51aec820-9d49-40a9-b046-17c1f28f620d'

GITHUB_CLIENT_ID = '8577f13ddc81e2848b07'
GITHUB_STATE = '1337'


class ProviderName(str, Enum):
    ACTIVE_DIRECTORY = 'active_directory'
    BITBUCKET = 'bitbucket'
    GITHUB = 'github'
    GITLAB = 'gitlab'
    GHE = 'ghe'
    GOOGLE = 'google'
    OKTA = 'okta'
    OIDC_GENERIC = 'oidc_generic'


VALID_OAUTH_PROVIDERS = [e.value for e in ProviderName]

DEFAULT_GITHUB_HOSTNAME = 'https://github.com'

GIT_OAUTH_PROVIDERS = [
    ProviderName.BITBUCKET,
    ProviderName.GITLAB,
]


def get_ghe_hostname() -> Optional[str]:
    ghe_hostname = get_settings_value(GHE_HOSTNAME)
    if ghe_hostname and not ghe_hostname.startswith('http'):
        ghe_hostname = f'https://{ghe_hostname}'

    return ghe_hostname
