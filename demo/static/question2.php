<?php require_once 'framework.php'; ?>
<?php get_header('Hebrew | Now Studying | Sleepless Demo', 'question-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front fade-in">
			<span class="card-field center-field rtl">בקבוק</span>
			<span class="card-field small-field center-field">bokbuk</span>
		</div>
	</section>
	<section id="back">
		<form method="post" action="answer2.php" class="is-muted">
			<span class="input-btn mega-btn" id="study-show-answer"><input type="submit" name="show-answer" value="Show Answer" /></span>
		</form>
		
		<div class="study-status">
			<span class="study-time">0:03</span> 
			<span class="study-progress">14/32</span> 
		</div>
	</section>
<?php get_footer('study'); ?>