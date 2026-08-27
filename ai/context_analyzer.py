import re


class ContextAnalyzer:
    """
    SentinelVoice AI - Context Analyzer V2

    Analyzes conversation transcripts for social-engineering
    and impersonation-fraud indicators.

    NOTE:
    This is an explainable prototype risk engine.
    It does not prove that a caller is fraudulent.
    """

    def __init__(self, assisted_protection=False):

        self.assisted_protection = assisted_protection

        # ---------------------------------------------------------
        # Individual risk categories
        # ---------------------------------------------------------

        self.risk_signals = {

            "financial_request": {
                "keywords": [
                    "money",
                    "cash",
                    "payment",
                    "transfer",
                    "send",
                    "upi",
                    "bank",
                    "account",
                    "transaction",
                    "funds",
                    "pay",
                ],
                "weight": 15,
            },

            "emergency": {
                "keywords": [
                    "accident",
                    "hospital",
                    "emergency",
                    "injured",
                    "medical",
                    "ambulance",
                    "critical",
                ],
                "weight": 18,
            },

            "urgency": {
                "keywords": [
                    "urgent",
                    "immediately",
                    "right now",
                    "quickly",
                    "as soon as possible",
                    "don't wait",
                    "do not wait",
                    "hurry",
                ],
                "weight": 15,
            },

            "authentication": {
                "keywords": [
                    "otp",
                    "one time password",
                    "pin",
                    "password",
                    "verification code",
                    "cvv",
                ],
                "weight": 25,
            },

            "authority_threat": {
                "keywords": [
                    "police",
                    "arrest",
                    "court",
                    "legal action",
                    "case",
                    "officer",
                    "cbi",
                ],
                "weight": 20,
            },

            "secrecy": {
                "keywords": [
                    "don't tell",
                    "do not tell",
                    "keep this secret",
                    "secret",
                    "nobody should know",
                    "don't tell anyone",
                    "do not tell anyone",
                ],
                "weight": 18,
            },
        }

        # ---------------------------------------------------------
        # Emotional-pressure indicators
        # ---------------------------------------------------------

        self.emotion_signals = {

            "fear": [
                "accident",
                "hospital",
                "injured",
                "police",
                "arrest",
                "danger",
                "emergency",
            ],

            "urgency": [
                "urgent",
                "immediately",
                "right now",
                "quickly",
                "hurry",
                "don't wait",
                "do not wait",
            ],

            "threat": [
                "arrest",
                "police",
                "court",
                "legal action",
                "case",
            ],
        }

        # ---------------------------------------------------------
        # Behavioral combinations
        #
        # These are more important than isolated keywords.
        # ---------------------------------------------------------

        self.combination_rules = [

            {
                "name": "financial_plus_urgency",
                "categories": [
                    "financial_request",
                    "urgency",
                ],
                "bonus": 15,
                "reason": (
                    "Financial request combined with urgency "
                    "creates pressure to act without verification."
                ),
            },

            {
                "name": "financial_plus_emergency",
                "categories": [
                    "financial_request",
                    "emergency",
                ],
                "bonus": 15,
                "reason": (
                    "A financial request is being justified using "
                    "an emergency situation."
                ),
            },

            {
                "name": "financial_plus_secrecy",
                "categories": [
                    "financial_request",
                    "secrecy",
                ],
                "bonus": 20,
                "reason": (
                    "The caller combines a financial request with "
                    "pressure to keep the interaction secret."
                ),
            },

            {
                "name": "authentication_plus_urgency",
                "categories": [
                    "authentication",
                    "urgency",
                ],
                "bonus": 20,
                "reason": (
                    "Sensitive authentication information is being "
                    "requested under time pressure."
                ),
            },

            {
                "name": "authority_plus_financial",
                "categories": [
                    "authority_threat",
                    "financial_request",
                ],
                "bonus": 20,
                "reason": (
                    "Authority or legal pressure is combined with "
                    "a financial request."
                ),
            },

            {
                "name": "emergency_plus_urgency",
                "categories": [
                    "emergency",
                    "urgency",
                ],
                "bonus": 10,
                "reason": (
                    "An emergency is being used together with "
                    "strong time pressure."
                ),
            },

            {
                "name": "financial_emergency_urgency",
                "categories": [
                    "financial_request",
                    "emergency",
                    "urgency",
                ],
                "bonus": 20,
                "reason": (
                    "Financial demand, emergency narrative and "
                    "time pressure form a strong social-engineering pattern."
                ),
            },

            {
                "name": "financial_urgency_secrecy",
                "categories": [
                    "financial_request",
                    "urgency",
                    "secrecy",
                ],
                "bonus": 20,
                "reason": (
                    "The caller combines financial pressure, urgency "
                    "and secrecy to discourage independent verification."
                ),
            },
        ]

    # =============================================================
    # TEXT PROCESSING
    # =============================================================

    def _normalize_text(self, text):
        """Normalize transcript text before analysis."""

        text = text.lower()

        text = re.sub(
            r"[^\w\s₹]",
            " ",
            text,
            flags=re.UNICODE,
        )

        text = re.sub(r"\s+", " ", text)

        return text.strip()

    def _contains_keyword(self, text, keyword):
        """
        Check for a keyword/phrase without matching it inside
        unrelated words.
        """

        pattern = r"(?<!\w)" + re.escape(keyword) + r"(?!\w)"

        return re.search(pattern, text) is not None

    def _find_matches(self, text, keywords):
        """Return keywords actually detected in the transcript."""

        matches = []

        for keyword in keywords:

            if self._contains_keyword(text, keyword):
                matches.append(keyword)

        return matches

    # =============================================================
    # SIGNAL DETECTION
    # =============================================================

    def _detect_signals(self, text):
        """Detect individual risk categories."""

        detected_signals = {}

        for category, data in self.risk_signals.items():

            matches = self._find_matches(
                text,
                data["keywords"],
            )

            if matches:
                detected_signals[category] = matches

        return detected_signals

    # =============================================================
    # RISK CALCULATION
    # =============================================================

    def _calculate_risk(self, detected_signals):
        """
        Calculate risk using:
        1. Base category scores
        2. Behavioral combination bonuses
        """

        score = 0

        reasons = []

        triggered_patterns = []

        # ---------------------------------------------------------
        # Base scores
        # ---------------------------------------------------------

        for category, matches in detected_signals.items():

            weight = self.risk_signals[category]["weight"]

            score += weight

            reasons.append(
                f"{category.replace('_', ' ').title()} detected "
                f"({', '.join(matches)})."
            )

        # ---------------------------------------------------------
        # Combination scores
        # ---------------------------------------------------------

        detected_categories = set(
            detected_signals.keys()
        )

        for rule in self.combination_rules:

            required_categories = set(
                rule["categories"]
            )

            if required_categories.issubset(
                detected_categories
            ):

                score += rule["bonus"]

                triggered_patterns.append(
                    rule["name"]
                )

                reasons.append(
                    rule["reason"]
                )

        score = min(score, 100)

        return score, reasons, triggered_patterns

    # =============================================================
    # EMOTION / PRESSURE
    # =============================================================

    def _detect_emotional_pressure(self, text):
        """Estimate linguistic emotional pressure."""

        emotion_scores = {}

        for emotion, keywords in self.emotion_signals.items():

            matches = self._find_matches(
                text,
                keywords,
            )

            emotion_scores[emotion] = len(matches)

        if not any(emotion_scores.values()):
            return "Neutral"

        return max(
            emotion_scores,
            key=emotion_scores.get,
        ).title()

    # =============================================================
    # URGENCY
    # =============================================================

    def _detect_urgency(self, text):

        matches = self._find_matches(
            text,
            self.emotion_signals["urgency"],
        )

        if len(matches) >= 2:
            return "Critical"

        if len(matches) == 1:
            return "High"

        return "Normal"

    # =============================================================
    # RISK LEVEL
    # =============================================================

    def _get_risk_level(self, score):

        if score >= 70:
            return "High"

        if score >= 40:
            return "Medium"

        return "Low"

    # =============================================================
    # RECOMMENDATIONS
    # =============================================================

    def _generate_recommendations(
        self,
        risk_level,
        detected_signals,
    ):

        recommendations = []

        if "financial_request" in detected_signals:

            recommendations.append(
                "Do not transfer money during the call."
            )

        if "authentication" in detected_signals:

            recommendations.append(
                "Never share OTP, PIN, password or CVV."
            )

        if "emergency" in detected_signals:

            recommendations.append(
                "Independently verify the emergency "
                "using a trusted contact."
            )

        if "authority_threat" in detected_signals:

            recommendations.append(
                "Verify the caller through an official channel."
            )

        if "secrecy" in detected_signals:

            recommendations.append(
                "Do not act on requests that discourage "
                "independent verification."
            )

        if "urgency" in detected_signals:

            recommendations.append(
                "Pause before taking financial or security-sensitive action."
            )

        if risk_level == "High":

            recommendations.append(
                "End the call and verify the caller using "
                "a known contact method."
            )

        if not recommendations:

            recommendations.append(
                "No immediate high-risk social-engineering "
                "pattern detected. Continue to remain cautious."
            )

        return recommendations

    # =============================================================
    # ASSISTED PROTECTION MODE
    # =============================================================

    def _generate_assisted_protection(
        self,
        risk_level,
        detected_signals,
    ):
        """
        Additional safeguards for users who enable
        Assisted Protection Mode.

        IMPORTANT:
        This mode does NOT increase the fraud score merely
        because the user is older.
        """

        if not self.assisted_protection:
            return {
                "enabled": False,
                "recommended_action": None,
                "additional_safeguards": [],
            }

        safeguards = []

        if "financial_request" in detected_signals:

            safeguards.append(
                "Show a prominent financial-warning prompt."
            )

            safeguards.append(
                "Require an additional confirmation before "
                "any transaction is initiated."
            )

        if risk_level in ["Medium", "High"]:

            safeguards.append(
                "Recommend verifying the caller through "
                "a previously trusted contact."
            )

        if risk_level == "High":

            safeguards.append(
                "Recommend pausing the transaction until "
                "the caller's identity is independently verified."
            )

            safeguards.append(
                "Offer optional trusted-contact assistance."
            )

        if risk_level == "Low":

            action = "Continue conversation with normal caution."

        elif risk_level == "Medium":

            action = "Pause and verify before taking sensitive action."

        else:

            action = (
                "Pause sensitive actions and independently verify "
                "the caller."
            )

        return {
            "enabled": True,
            "recommended_action": action,
            "additional_safeguards": safeguards,
        }

    # =============================================================
    # MAIN ANALYSIS
    # =============================================================

    def analyze(self, transcript):

        if not isinstance(transcript, str):
            raise TypeError(
                "Transcript must be a string."
            )

        if not transcript.strip():
            raise ValueError(
                "Transcript cannot be empty."
            )

        normalized_text = self._normalize_text(
            transcript
        )

        detected_signals = self._detect_signals(
            normalized_text
        )

        (
            risk_score,
            reasons,
            triggered_patterns,
        ) = self._calculate_risk(
            detected_signals
        )

        risk_level = self._get_risk_level(
            risk_score
        )

        emotional_pressure = (
            self._detect_emotional_pressure(
                normalized_text
            )
        )

        urgency = self._detect_urgency(
            normalized_text
        )

        recommendations = (
            self._generate_recommendations(
                risk_level,
                detected_signals,
            )
        )

        assisted_protection = (
            self._generate_assisted_protection(
                risk_level,
                detected_signals,
            )
        )

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,

            "emotional_pressure": emotional_pressure,

            "urgency": urgency,

            "detected_signals": detected_signals,

            "triggered_patterns": triggered_patterns,

            "risk_reasons": reasons,

            "recommendations": recommendations,

            "assisted_protection": assisted_protection,
        }


# ================================================================
# DEMO / TEST
# ================================================================

if __name__ == "__main__":

    analyzer = ContextAnalyzer(
        assisted_protection=True
    )

    sample_transcript = """
    Good morning. So there is a scheme called money double in two days. In that we take money from you and make it double in two to three days and we give it back to you with little bit of brokerage charges. Like if you give 20,000 something we make it 40,000 and as a brokerage charges we deduct only 20 to 30 rupees one and we give it back the rest amount of you to the rest of the amount back to you in only 5 to 7 days.
    """

    result = analyzer.analyze(
        sample_transcript
    )

    print("\n========================================")
    print(" SentinelVoice AI - Context Analyzer V2")
    print("========================================")

    for key, value in result.items():

        print(f"\n{key}:")
        print(value)