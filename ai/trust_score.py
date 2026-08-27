class TrustScoreEngine:
    """
    SentinelVoice AI - Trust Score Engine

    Combines multiple risk signals into a single overall
    risk/trust assessment.

    IMPORTANT:
    This is a prototype scoring engine.
    The weights are configurable and are not scientifically
    validated probabilities.
    """

    def __init__(
        self,
        voice_weight=0.5,
        context_weight=0.5,
    ):
        """
        Initialize the trust engine.

        Default:
            Voice analysis     = 50%
            Context analysis   = 50%

        These weights can be changed later after testing.
        """

        if voice_weight < 0 or context_weight < 0:
            raise ValueError(
                "Weights cannot be negative."
            )

        total_weight = voice_weight + context_weight

        if total_weight == 0:
            raise ValueError(
                "At least one weight must be greater than zero."
            )

        # Normalize weights so they always add up to 1.
        self.voice_weight = (
            voice_weight / total_weight
        )

        self.context_weight = (
            context_weight / total_weight
        )

    # ==========================================================
    # VALIDATION
    # ==========================================================

    def _validate_score(self, score, name):
        """Validate an individual risk score."""

        if not isinstance(score, (int, float)):
            raise TypeError(
                f"{name} must be a number."
            )

        if score < 0 or score > 100:
            raise ValueError(
                f"{name} must be between 0 and 100."
            )

    # ==========================================================
    # OVERALL RISK
    # ==========================================================

    def _calculate_overall_risk(
        self,
        voice_risk,
        context_risk,
    ):
        """
        Calculate weighted overall risk.
        """

        overall_risk = (
            voice_risk * self.voice_weight
            +
            context_risk * self.context_weight
        )

        return round(overall_risk)

    # ==========================================================
    # RISK LEVEL
    # ==========================================================

    def _get_risk_level(self, risk_score):

        if risk_score >= 70:
            return "High"

        if risk_score >= 40:
            return "Medium"

        return "Low"

    # ==========================================================
    # TRUST SCORE
    # ==========================================================

    def _calculate_trust_score(self, risk_score):

        return 100 - risk_score

    # ==========================================================
    # RECOMMENDATION
    # ==========================================================

    def _get_action(self, risk_level):

        if risk_level == "High":

            return {
                "action": "BLOCK_OR_PAUSE",
                "message": (
                    "High-risk interaction detected. "
                    "Pause sensitive actions and verify "
                    "the caller independently."
                ),
            }

        if risk_level == "Medium":

            return {
                "action": "VERIFY",
                "message": (
                    "Suspicious indicators detected. "
                    "Verify the caller before taking "
                    "sensitive actions."
                ),
            }

        return {
            "action": "CONTINUE_WITH_CAUTION",
            "message": (
                "No strong risk indicators detected. "
                "Continue with normal caution."
            ),
        }

    # ==========================================================
    # MAIN ENGINE
    # ==========================================================

    def calculate(
        self,
        voice_risk_score,
        context_risk_score,
    ):
        """
        Combine voice and conversation risk.

        Parameters:
            voice_risk_score:
                0 = no detected voice risk
                100 = very high voice risk

            context_risk_score:
                0 = no detected conversation risk
                100 = very high conversation risk
        """

        self._validate_score(
            voice_risk_score,
            "voice_risk_score",
        )

        self._validate_score(
            context_risk_score,
            "context_risk_score",
        )

        overall_risk = self._calculate_overall_risk(
            voice_risk_score,
            context_risk_score,
        )

        risk_level = self._get_risk_level(
            overall_risk
        )

        trust_score = self._calculate_trust_score(
            overall_risk
        )

        action = self._get_action(
            risk_level
        )

        return {
            "voice_risk_score": round(
                voice_risk_score
            ),

            "context_risk_score": round(
                context_risk_score
            ),

            "overall_risk_score": overall_risk,

            "trust_score": trust_score,

            "risk_level": risk_level,

            "decision": action["action"],

            "message": action["message"],

            "weights": {
                "voice": round(
                    self.voice_weight,
                    2,
                ),
                "context": round(
                    self.context_weight,
                    2,
                ),
            },
        }


# ==============================================================
# DEMO
# ==============================================================

if __name__ == "__main__":

    engine = TrustScoreEngine()

    # Temporary test values.
    # Later voice_risk_score will come from voice_detector.py.
    # context_risk_score will come from context_analyzer.py.

    result = engine.calculate(
        voice_risk_score=82,
        context_risk_score=76,
    )

    print("\n========================================")
    print(" SentinelVoice AI - Trust Score Engine")
    print("========================================")

    for key, value in result.items():
        print(f"\n{key}:")
        print(value)