from context_analyzer import ContextAnalyzer
from trust_score import TrustScoreEngine


def analyze_call(transcript, voice_risk_score=0, assisted_protection=True):

    # ---------------------------------------------------------
    # 1. Analyze conversation
    # ---------------------------------------------------------

    context_analyzer = ContextAnalyzer(
        assisted_protection=assisted_protection
    )

    context_result = context_analyzer.analyze(
        transcript
    )

    context_risk = context_result["risk_score"]

    # ---------------------------------------------------------
    # 2. Combine voice + context risk
    # ---------------------------------------------------------

    trust_engine = TrustScoreEngine(
        voice_weight=0.5,
        context_weight=0.5,
    )

    trust_result = trust_engine.calculate(
        voice_risk_score=voice_risk_score,
        context_risk_score=context_risk,
    )

    # ---------------------------------------------------------
    # 3. Combine results
    # ---------------------------------------------------------

    return {
        "context_analysis": context_result,
        "trust_analysis": trust_result,
    }


# ============================================================
# DEMO
# ============================================================

if __name__ == "__main__":

    transcript = """
    I had an accident and I am at the hospital.
    Please send 50000 immediately.
    Don't tell anyone.
    I need the money right now.
    """

    # Temporary voice score.
    # Later this will come from our voice detector.
    voice_risk = 82

    result = analyze_call(
        transcript=transcript,
        voice_risk_score=voice_risk,
        assisted_protection=True,
    )

    context = result["context_analysis"]
    trust = result["trust_analysis"]

    print("\n========================================")
    print("       SentinelVoice AI Pipeline")
    print("========================================")

    print("\n--- CONTEXT ANALYSIS ---")

    print("\nContext Risk:")
    print(context["risk_score"])

    print("\nContext Level:")
    print(context["risk_level"])

    print("\nEmotional Pressure:")
    print(context["emotional_pressure"])

    print("\nUrgency:")
    print(context["urgency"])

    print("\nDetected Signals:")
    print(context["detected_signals"])

    print("\nTriggered Patterns:")
    print(context["triggered_patterns"])

    print("\nRisk Reasons:")

    for reason in context["risk_reasons"]:
        print(f"  - {reason}")

    print("\nRecommendations:")

    for recommendation in context["recommendations"]:
        print(f"  - {recommendation}")

    print("\n--- TRUST ANALYSIS ---")

    print("\nVoice Risk:")
    print(trust["voice_risk_score"])

    print("\nContext Risk:")
    print(trust["context_risk_score"])

    print("\nOverall Risk:")
    print(trust["overall_risk_score"])

    print("\nTrust Score:")
    print(trust["trust_score"])

    print("\nRisk Level:")
    print(trust["risk_level"])

    print("\nDecision:")
    print(trust["decision"])

    print("\nMessage:")
    print(trust["message"])

    print("\nAssisted Protection:")
    print(context["assisted_protection"])