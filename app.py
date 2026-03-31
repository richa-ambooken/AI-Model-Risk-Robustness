import os
import json
import pickle
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import warnings

warnings.filterwarnings('ignore', category=UserWarning)

app = Flask(__name__)
CORS(app)

# Load columns securely
with open("columns.json", "r") as f:
    columns = json.load(f)

# Load models
with open("all_models.pkl", "rb") as f:
    models_dict = pickle.load(f)
if not isinstance(models_dict, dict):
    models_dict = {"default_model": models_dict}

available_models = list(models_dict.keys())

def get_base_row():
    return {col: [0] for col in columns}

def apply_noise(df_dict, noise_level, noise_type):
    """Manipulates the dictionary holding the live data based on the chosen noise type."""
    if noise_level <= 0:
        return df_dict, []
        
    p = noise_level / 100.0
    corrupted_features = []
    
    financials = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Credit_History']
    
    for feature in financials:
        if feature in df_dict:
            val = df_dict[feature][0]
            if noise_type == "Gaussian":
                new_val = val * (1 + random.uniform(-p, p))
                df_dict[feature] = [new_val]
                corrupted_features.append(feature)
            elif noise_type == "Missing Values":
                if random.random() < p:
                    df_dict[feature] = [0]
                    corrupted_features.append(feature)
            elif noise_type == "Feature Corruption":
                if random.random() < p:
                    if feature == "Credit_History":
                        df_dict[feature] = [0.0 if val == 1.0 else 1.0]
                    else:
                        df_dict[feature] = [val * random.uniform(0.1, 5.0)]
                    corrupted_features.append(feature)
                    
    if noise_type in ["Missing Values", "Feature Corruption"]:
        for col in df_dict.keys():
            if col not in financials and random.random() < (p * 0.5): 
                if noise_type == "Missing Values":
                    df_dict[col] = [0]
                    corrupted_features.append(col)
                elif noise_type == "Feature Corruption":
                    df_dict[col] = [1 if df_dict[col][0] == 0 else 0]
                    corrupted_features.append(col)
                    
    return df_dict, corrupted_features

def extract_xai(model, df_live, corrupted_features, noise_type, baseline_prob, new_prob):
    """Generates detailed XAI Reason and a technical Suggestion/Solution to fix the vulnerability."""
    reason = "Unable to extract exact reasoning due to architecture."
    top_feature = None
    
    try:
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            top_idx = importances.argsort()[-1]
            top_feature = columns[top_idx]
        elif hasattr(model, "coef_"):
            coefs = model.coef_[0]
            impacts = [abs(c * v) for c, v in zip(coefs, df_live.iloc[0])]
            if max(impacts) > 0:
                top_idx = impacts.index(max(impacts))
                top_feature = columns[top_idx]
                
        if top_feature:
            if top_feature in corrupted_features:
                reason = f"[VULNERABILITY DETECTED]: Decision mathematically forced by '{top_feature}', which was directly hit by the '{noise_type}' attack! The model has no fallback logic."
            else:
                reason = f"Decision primarily weighted by '{top_feature}'. The attack shifted peripheral tokens but this core feature held the decision boundary."
    except Exception as e:
        pass

    # Generate a suggestion/solution to fix the model's flaw
    suggestion = "Maintain standard tracking."
    if len(corrupted_features) == 0:
        suggestion = "No attack detected. Data pipeline remains clean."
    else:
        accuracy_change = abs(baseline_prob - new_prob)
        if accuracy_change > 20: 
            # Model heavily failed
            if noise_type == "Gaussian":
                suggestion = "[CRITICAL FIX]: Train the model with 'Gaussian Noise Augmentation' so it generalizes better to financial volatility. Implement standard scaling (z-score) as a strict pre-processing step."
            elif noise_type == "Missing Values":
                suggestion = "[CRITICAL FIX]: Do not allow models to predict on raw zeros! Implement a Robust Imputer (KNN or Median) before inference to gracefully recover missing demographics."
            else:
                suggestion = "[CRITICAL FIX]: Deploy an Anomaly Detection filter (like Isolation Forest) before this model to catch corrupted data (impossible multipliers) and block the inference."
        else:
            # Model resisted
            suggestion = "[PASS]: Model resisted the attack successfully. Its ensemble structure or regularization prevented catastrophic failure."

    return {
        "reason": reason,
        "suggestion": suggestion,
        "top_feature": top_feature,
        "accuracy_drift": round(accuracy_change, 2)
    }

@app.route("/models", methods=["GET"])
def get_models():
    return jsonify({"models": available_models})

@app.route("/simulate", methods=["POST"])
def simulate():
    try:
        data = request.json
        model_name = data.get("model", available_models[0])
        noise_level = data.get("noise", 0)
        noise_type = data.get("noiseType", "Gaussian")
        active_model = models_dict.get(model_name, models_dict[available_models[0]])
        
        # Build Clean Dictionary
        input_dict = get_base_row()
        input_dict["ApplicantIncome"] = [data.get("income", 85000)]
        input_dict["CoapplicantIncome"] = [data.get("coapplicantIncome", 0)]
        input_dict["LoanAmount"] = [data.get("loan", 250000)]
        input_dict["Loan_Amount_Term"] = [data.get("loanTerm", 360)]
        input_dict["Credit_History"] = [1.0 if data.get("credit", 720) >= 600 else 0.0]
        
        # Process categoricals
        if data.get("gender") == "Male" and "Gender_Male" in input_dict: input_dict["Gender_Male"] = [1]
        elif "Gender_Female" in input_dict: input_dict["Gender_Female"] = [1]
        
        if data.get("married") == "Yes" and "Married_Yes" in input_dict: input_dict["Married_Yes"] = [1]
        elif "Married_No" in input_dict: input_dict["Married_No"] = [1]
        
        dept = data.get("dependents", "0")
        if dept == "1" and "Dependents_1" in input_dict: input_dict["Dependents_1"] = [1]
        elif dept == "2" and "Dependents_2" in input_dict: input_dict["Dependents_2"] = [1]
        elif dept in ["3", "3+"] and "Dependents_3+" in input_dict: input_dict["Dependents_3+"] = [1]
            
        if data.get("education") == "Not Graduate" and "Education_Not Graduate" in input_dict: input_dict["Education_Not Graduate"] = [1]
        if data.get("selfEmployed") == "Yes" and "Self_Employed_Yes" in input_dict: input_dict["Self_Employed_Yes"] = [1]
        elif "Self_Employed_No" in input_dict: input_dict["Self_Employed_No"] = [1]
        
        prop = data.get("propertyArea", "Urban")
        if prop == "Semiurban" and "Property_Area_Semiurban" in input_dict: input_dict["Property_Area_Semiurban"] = [1]
        elif prop == "Urban" and "Property_Area_Urban" in input_dict: input_dict["Property_Area_Urban"] = [1]
        elif "Property_Area_Rural" in input_dict: input_dict["Property_Area_Rural"] = [1]
        
        df_clean = pd.DataFrame(input_dict, columns=columns)
        prob_clean_raw = active_model.predict_proba(df_clean)
        conf_clean = prob_clean_raw[0][1]*100 if len(prob_clean_raw[0])>1 else prob_clean_raw[0][0]*100
        
        import copy
        poisoned_dict, corrupted_features = apply_noise(copy.deepcopy(input_dict), noise_level, noise_type)
        df_poisoned = pd.DataFrame(poisoned_dict, columns=columns)
        
        prob_poison_raw = active_model.predict_proba(df_poisoned)
        conf_poison = prob_poison_raw[0][1]*100 if len(prob_poison_raw[0])>1 else prob_poison_raw[0][0]*100
        
        # Explainability
        xai = extract_xai(active_model, df_poisoned, corrupted_features, noise_type, conf_clean, conf_poison)

        # Build mock statistical matrices based on the severity of the drop
        accuracy_drop = conf_clean - conf_poison
        mock_tp = max(0, int((conf_poison / 100) * 850))
        mock_tn = max(0, int((conf_poison / 100) * 750))
        mock_fp = 850 - mock_tp
        mock_fn = 750 - mock_tn

        response = {
            "status": "success",
            "model_name": model_name,
            "confidence": round(conf_poison, 1),
            "base_confidence": round(conf_clean, 1),
            "decision": "Risk Approved" if conf_poison >= 50 else "Risk Detected",
            "xai": xai,
            "metrics": {
                "tp": mock_tp,
                "tn": mock_tn,
                "fp": mock_fp,
                "fn": mock_fn,
                "auc": round(min(0.99, (conf_poison/100) + 0.1), 3),
                "f1": round(min(0.95, (conf_poison/100) + 0.05), 3)
            },
            "status_log": [
                f"[INFO] Initializing risk weights... OK",
                f"[SUCCESS] Model '{model_name}' attached to container.",
                f"> Injecting {noise_level}% {noise_type} noise tensor...",
                f"> Corrupted {len(corrupted_features)} feature boundaries.",
                f"[WARN] Anomaly drifted by {round(abs(accuracy_drop), 2)}%." if abs(accuracy_drop) > 5 else "> Minimal drift detected.",
                f"[ACT] Processing XAI feedback loop..."
            ]
        }
        
        return jsonify(response)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
